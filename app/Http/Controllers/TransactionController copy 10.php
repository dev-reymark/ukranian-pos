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
            $maxBIRTransNumber = Transaction::max('BIR_Trans_Number');
            $newBIRTransNumber = $maxBIRTransNumber ? $maxBIRTransNumber + 1 : 1;

            // Save Transaction
            $transaction = new Transaction([
                'Tax_Total' => $validated['taxTotal'],
                'Sale_Total' => $validated['subtotal'],
                'POS_ID' => 1,
                'Transaction_Number' => 1,
                'Transaction_Date' => now(),
                'Period_ID' => 1,
                'Cashier_ID' => $cashier->Cashier_ID,
                'BIR_Trans_Number' => $newBIRTransNumber,
            ]);
            $transaction->save();

            $transactionId = DB::getPdo()->lastInsertId();

            // Save TransactionItems using the stored procedure
            $itemNumber = 1;
            foreach ($validated['deliveryIds'] as $pump) {
                $pumpNumber = str_pad($pump['Pump'], 2, '0', STR_PAD_LEFT);
                $itemDescription = $pumpNumber . '-' . $pump['FuelGradeName'];

                $result = DB::statement(
                    'EXEC dbo.SP_LOG_TRANSACTION_ITEM ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?',
                    [
                        (int) $transactionId,
                        (int) $itemNumber,
                        1, // ITEM_TAX_ID
                        2, // ITEM_TYPE: Post Pay Delivery
                        substr($itemDescription, 0, 20), // ITEM_DESC: CHAR(20)
                        (float) $pump['Price'],
                        (float) $pump['Volume'],
                        (float) $pump['Amount'],
                        0, // ITEM_ID - provide actual value if available
                        0, // ITEM_TAX_AMOUNT - provide actual value if available
                        0, // DELIVERY_ID - provide actual value if available
                        null, // original_item_value_pre_tax_change (optional)
                        null, // is_tax_exempt_item (optional)
                        null, // is_zero_rated_tax_item (optional)
                        null, // pos_id (optional)
                        null, // ITEM_DISCOUNT_TOTAL (optional)
                        null, // discount_code_type (optional)
                        null, // item_DB_Price (optional)
                        null  // discount_preset_id (optional)
                    ]
                );

                if (!$result) {
                    throw new \Exception('Failed to execute stored procedure for transaction item');
                }

                $itemNumber++;
            }

            // Add `mopPayments`
            foreach ($validated['mopPayments'] as $payment) {
                $result = DB::statement(
                    'EXEC dbo.SP_LOG_TRANSACTION_ITEM ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?',
                    [
                        (int) $transactionId,
                        (int) $itemNumber,
                        1, // ITEM_TAX_ID
                        7, // ITEM_TYPE: Mop
                        substr($payment['mopName'], 0, 20), // ITEM_DESC
                        0, // ITEM_PRICE
                        0, // ITEM_QTY
                        (float) $payment['amount'],
                        0, // ITEM_ID
                        0, // ITEM_TAX_AMOUNT
                        0, // DELIVERY_ID
                        null, // original_item_value_pre_tax_change
                        null, // is_tax_exempt_item
                        null, // is_zero_rated_tax_item
                        null, // pos_id
                        null, // ITEM_DISCOUNT_TOTAL
                        null, // discount_code_type
                        null, // item_DB_Price
                        null  // discount_preset_id
                    ]
                );

                if (!$result) {
                    throw new \Exception('Failed to execute stored procedure for mop payment item');
                }

                $itemNumber++;
            }

            // Add `change`
            $result = DB::statement(
                'EXEC dbo.SP_LOG_TRANSACTION_ITEM ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?',
                [
                    (int) $transactionId,
                    (int) $itemNumber,
                    1, // ITEM_TAX_ID
                    10, // ITEM_TYPE: Change
                    'Change', // ITEM_DESC
                    0, // ITEM_PRICE
                    0, // ITEM_QTY
                    (float) $validated['change'],
                    0, // ITEM_ID
                    0, // ITEM_TAX_AMOUNT
                    0, // DELIVERY_ID
                    null, // original_item_value_pre_tax_change
                    null, // is_tax_exempt_item
                    null, // is_zero_rated_tax_item
                    null, // pos_id
                    null, // ITEM_DISCOUNT_TOTAL
                    null, // discount_code_type
                    null, // item_DB_Price
                    null  // discount_preset_id
                ]
            );

            if (!$result) {
                throw new \Exception('Failed to execute stored procedure for change item');
            }

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
