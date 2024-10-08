<?php

namespace App\Http\Controllers;

use App\Models\Period;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PeriodController extends Controller
{
    public function getCshrActShiftPeriod(Request $request, Period $period)
    {
        $cashier = Auth::user();

        if (!$cashier) {
            return response()->json(['error' => 'Cashier not authenticated'], 401);
        }

        $cashierID = $cashier->Cashier_ID;
        Log::info('Cashier ID: ' . $cashierID);

        // Fetch the active shift period using the cashier ID
        $periodID = $period->getCashierActiveShiftPeriod($cashierID);

        if (!$periodID) {
            return response()->json([
                'statusCode' => 0,
                'statusDescription' => 'Failed to retrieve period ID'
            ]);
        }

        return response()->json([
            'statusCode' => 1,
            'statusDescription' => 'Success',
            'data' => $periodID
        ]);
    }

    public function closePeriod(Request $request, Period $period)
    {
        // Get POST data from request
        $periodType = $request->input('periodType');
        $posID = $request->input('posID');

        // Call the closePeriod method in Period model
        $returnCloseData = $period->closePeriod($periodType);

        if (!$returnCloseData['result']) {
            return response()->json([
                'statusCode' => 0,
                'statusDescription' => 'Failed to close period'
            ]);
        }

        return response()->json([
            'statusCode' => 1,
            'statusDescription' => 'Period closed successfully'
        ]);
    }

    // public function getAllPeriod(Request $request, Period $period)
    // {
    //     // Get type from the request
    //     // $type = $request->input('type');
    //     // $posID = $request->input('posID');

    //     $type = 1;
    //     $posID = 1;

    //     // Call the getAllPeriod method in the Period model
    //     $returnData = $period->getAllPeriod($type);

    //     if ($returnData === false) {
    //         return response()->json([
    //             'statusCode' => 0,
    //             'statusDescription' => 'Failed to retrieve periods'
    //         ]);
    //     }

    //     return response()->json([
    //         'statusCode' => 1,
    //         'statusDescription' => 'Success',
    //         'data' => $returnData
    //     ]);
    // }

    public function getAllPeriod(Request $request, Period $period)
    {
        // Call the getAllPeriod method in the Period model
        $periods = $period->getAllPeriod($type);

        if ($periods->isEmpty()) { // Check if there are no periods
            return response()->json([
                'statusCode' => 0,
                'statusDescription' => 'Failed to retrieve periods'
            ]);
        }

        // Prepare the data to include period reports
        $periodReports = [];

        // Iterate over each period and get its report
        foreach ($periods as $periodItem) {
            $periodID = $periodItem->Period_ID; // Assuming you have Period_ID in the result
            $reportData = $period->getPeriodReport($periodID, $posID);

            // Include the report in the response
            $periodReports[] = [
                'period' => $periodItem,
                'report' => $reportData['data'] ?? [], // Use an empty array if no report data
                'result' => $reportData["result"] ?? 0 // Include the result status
            ];
        }

        return response()->json([
            'statusCode' => 1,
            'statusDescription' => 'Success',
            'data' => $periodReports // Include periods with their reports
        ]);
    }


    public function getPeriodReport(Request $request, Period $period)
    {

        $posID = 1;
        $periodID = 1;

        // Call the getPeriodReport method from the Period model
        $returnData = $period->getPeriodReport($periodID, $posID);

        if ($returnData["result"]) {
            return response()->json([
                "statusCode" => 1,
                "statusDescription" => "Success",
                "data" => $returnData['data']
            ]);
        }

        return response()->json([
            "statusCode" => 0,
            "statusDescription" => "Failed to retrieve period report"
        ]);
    }
}
