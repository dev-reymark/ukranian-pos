<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ElectricJournal;
use App\Models\Transaction;

class ElectricJournalController extends Controller
{
    public function getJournal()
    {
        // Fetch ElectricJournal records with related Transaction and Cashier details
        $journals = ElectricJournal::with([
            'transaction' => function ($query) {
                $query->with('cashier'); // Load Cashier details with Transaction
            }
        ])->get();

        // Transform the data to include Sale_Total, Cashier_Name, and Cashier_ID
        $journalsData = $journals->map(function ($journal) {
            $transaction = $journal->transaction;
            return [
                'Transaction_ID' => $journal->Transaction_ID,
                'pos_id' => $journal->pos_id,
                'Transaction_Date' => $journal->Transaction_Date,
                'si_number' => $journal->si_number,
                'Data' => $journal->Data,
                'print_count' => $journal->print_count,
                'Sale_Total' => $transaction ? $transaction->Sale_Total : null,
                'Cashier_Name' => $transaction && $transaction->cashier ? $transaction->cashier->Cashier_Name : null,
                'Cashier_ID' => $transaction && $transaction->cashier ? $transaction->cashier->Cashier_ID : null,
            ];
        });

        return response()->json(['data' => $journalsData]);
    }
}
