<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\TransactionDetail;
use App\Models\PumpDelivery;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{ 
    public function storeTransaction(Request $request)
{
    $validated = $request->validate([
        'mopNames' => 'nullable|array',
        'mopPayments' => 'nullable|array',
        'taxTotal' => 'required|numeric',
        'change' => 'required|numeric',
        'subtotal' => 'required|numeric',
        'deliveryIds' => 'required|array',
        'customer' => 'required|array',
        'cardDetails' => 'nullable|array',
    ]);

    Log::info($validated);

    // Get the currently authenticated cashier
    $cashier = Auth::user();
    if (!$cashier) {
        return response()->json(['error' => 'Cashier not authenticated'], 401);
    }

    try {
        DB::beginTransaction();

        // Get the current maximum BIR_Trans_Number and increment it
        $maxBIRTransNumber = DB::table('transactions')->max('BIR_Trans_Number');
        $newBIRTransNumber = $maxBIRTransNumber ? $maxBIRTransNumber + 1 : 1;

        // Call the stored procedure to insert the transaction
        $result = DB::statement('EXEC dbo.SP_LOG_TRANSACTION ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?',
            [
                1, // POS_ID
                $cashier->Cashier_ID,
                1, // Transaction_Number
                now(),
                $validated['taxTotal'],
                $validated['subtotal'],
                $validated['change'],
                0, // SUB_ACCOUNT_ID
                0, // SUB_ACCOUNT_PMT
                0, // BIR_RECEIPT_TYPE
                $newBIRTransNumber,
                'PO12345678', // PO_NUMBER
                'ABC1234' // PLATE_NUMBER
            ]);

        if (!$result) {
            throw new \Exception('Failed to execute stored procedure');
        }

        $transactionId = DB::getPdo()->lastInsertId();

        // Save TransactionItems
        $itemNumber = 1;
        foreach ($validated['deliveryIds'] as $pump) {
            $pumpNumber = str_pad($pump['Pump'], 2, '0', STR_PAD_LEFT);
            $itemDescription = $pumpNumber . '-' . $pump['FuelGradeName'];
            DB::table('transaction_items')->insert([
                'Transaction_ID' => $transactionId,
                'Item_Description' => $itemDescription,
                'Item_Number' => $itemNumber,
                'Item_Type' => 2, // Post Pay Delivery
                'Item_Price' => $pump['Price'],
                'Item_Quantity' => $pump['Volume'],
                'Item_Value' => $pump['Amount'],
            ]);
            $itemNumber++;
        }
        // Add `mopPayments`
        foreach ($validated['mopPayments'] as $payment) {
            DB::table('transaction_items')->insert([
                'Transaction_ID' => $transactionId,
                'Item_Description' => $payment['mopName'],
                'Item_Number' => $itemNumber,
                'Item_Type' => 7, // Mop
                'Item_Price' => 0,
                'Item_Quantity' => 0,
                'Item_Value' => $payment['amount'],
            ]);
            $itemNumber++;
        }
        // Add `change`
        DB::table('transaction_items')->insert([
            'Transaction_ID' => $transactionId,
            'Item_Description' => 'Change',
            'Item_Number' => $itemNumber,
            'Item_Type' => 10, // Change
            'Item_Price' => 0,
            'Item_Quantity' => 0,
            'Item_Value' => $validated['change'],
        ]);

        // Extract delivery IDs if they are nested objects
        $deliveryIds = array_map(function ($pump) {
            return $pump['Delivery_ID'];
        }, $validated['deliveryIds']);

        // Save Card Details if provided
        if (isset($validated['cardDetails'])) {
            $fullCardNumber = $validated['cardDetails']['number'] ?? '';
            $lastFourDigits = substr($fullCardNumber, -4);

            DB::table('transaction_details')->insert([
                'Transaction_ID' => $transactionId,
                'CardNumber' => $lastFourDigits,  // Save only the last four digits
                'ApprovalCode' => $validated['cardDetails']['code'] ?? '',
                'CustomerName' => $validated['cardDetails']['name'] ?? '',
                'Type' => 1,
            ]);
        }

        // Update Is_Sold to 1 for relevant PumpDeliveries
        PumpDelivery::whereIn('Delivery_ID', $deliveryIds)
            ->update(['Is_Sold' => 1]);

        DB::commit();

        return response()->json([
            'message' => 'Transaction saved successfully',
            'transaction' => $transactionId,
        ], 201);

    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Transaction save failed: ' . $e->getMessage());

        return response()->json(['error' => 'Failed to save transaction'], 500);
    }
}
}
