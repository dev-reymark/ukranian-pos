<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class EJournalController extends Controller
{
    public function getAllTransJournal()
    {
        $transJourn = (new Transaction)->getAllTransJournal();

        if (!$transJourn['result']) {
            return response()->json([
                'statusCode' => 0,
                'statusDescription' => $transJourn['message']
            ]);
        }

        // Return a successful response with all transaction journal data
        return response()->json([
            'statusCode' => 1,
            'statusDescription' => $transJourn['message'],
            'data' => $transJourn['data']
        ]);
    }

    public function getTransJournalByDate(Request $request)
    {

        $date = $request->input('dateTo');
        $posID = $request->input('posID');

        if (is_null($date) || is_null($posID)) {
            return response()->json([
                'statusCode' => 0,
                'statusDescription' => 'Missing parameter/s'
            ]);
        }

        $transJourn = (new Transaction)->getTransJournal($date, $posID);

        if (!$transJourn['result']) {
            return response()->json([
                'statusCode' => 0,
                'statusDescription' => $transJourn['message']
            ]);
        }

        // Return a successful response with the transaction journal data
        return response()->json([
            'statusCode' => 1,
            'statusDescription' => $transJourn['message'],
            'data' => $transJourn['data']
        ]);
    }
}
