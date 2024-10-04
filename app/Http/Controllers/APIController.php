<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;


class APIController extends Controller
{
    public function getTransactions(Request $request)
    {
        // Retrieve all transactions
        $transactions = Transaction::with(['cashier','details','items'])->get();

        return response()->json($transactions);
    }

    public function saveTransaction(Request $request)
    {
        $validated = $request->validate([
            'transaction' => 'required|array',
        ]);

        Log::info('Received external transaction data', ['data' => $validated]);

        $transactionData = $validated['transaction'];

        // Convert Transaction_Date to a format compatible with SQL Server
        $transactionDate = Carbon::parse($transactionData['Transaction_Date'])->format('Y-m-d H:i:s');

        // Create a new Transaction record
        $transaction = new Transaction([
            'Tax_Total' => $transactionData['Tax_Total'],
            'Sale_Total' => $transactionData['Sale_Total'],
            'POS_ID' => $transactionData['POS_ID'] ?? 1,
            'Transaction_Number' => $transactionData['Transaction_Number'] ?? 1,
            'Transaction_Date' => $transactionDate,
            'Period_ID' => $transactionData['Period_ID'] ?? 1,
            'Cashier_ID' => $transactionData['Cashier_ID'] ?? null,
            'BIR_Trans_Number' => $transactionData['BIR_Trans_Number'],
        ]);
        $transaction->save();

        // // Save transaction items
        // foreach ($transactionData['TransactionItems'] as $item) {
        //     TransactionItem::create([
        //         'Transaction_ID' => $transaction->Transaction_ID,
        //         'Item_Description' => $item['Item_Description'],
        //         'Item_Number' => $item['Item_Number'],
        //         'Item_Type' => $item['Item_Type'],
        //         'Item_Price' => $item['Item_Price'],
        //         'Item_Quantity' => $item['Item_Quantity'],
        //         'Item_Value' => $item['Item_Value'],
        //     ]);
        // }

        // // Save card details if provided
        // if (isset($transactionData['TransactionDetail'])) {
        //     $cardDetails = $transactionData['TransactionDetail'];
        //     TransactionDetail::create([
        //         'Transaction_ID' => $transaction->Transaction_ID,
        //         'CardNumber' => $cardDetails['CardNumber'] ?? '',
        //         'ApprovalCode' => $cardDetails['ApprovalCode'] ?? '',
        //         'CustomerName' => $cardDetails['CustomerName'] ?? '',
        //         'Type' => $cardDetails['Type'] ?? 1,
        //     ]);
        // }

        // // Update PumpDelivery records if needed
        // if (isset($transactionData['PumpDeliveries'])) {
        //     $deliveryIds = array_column($transactionData['PumpDeliveries'], 'Delivery_ID');
        //     PumpDelivery::whereIn('Delivery_ID', $deliveryIds)->update(['Is_Sold' => 1]);
        // }

        return response()->json([
            'message' => 'Transaction processed successfully',
            'transaction' => $transaction->Transaction_ID,
        ], 201);
    }
}
