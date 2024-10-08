<?php

namespace App\Http\Controllers;

use App\Models\CashDrawPeriod;
use App\Models\Period;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
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

        // Check if the close period operation failed
        if (!$returnCloseData['result']) {
            return response()->json([
                'statusCode' => 0,
                'statusDescription' => 'Failed to close period',
            ]);
        }

        // Prepare the data for the external API
        $closePeriodData = [
            'SITEPERIOD' => [
                [
                    'posID' => $posID,
                    'periodType' => $periodType,
                    // Add other necessary data here
                ],
            ],
            'SitePeriod_Action' => 'insert',
        ];

        // Log the transaction data before sending it to the external API
        Log::info('Sending transaction data to external API', ['transactionData' => $closePeriodData]);

        // Send the serialized transaction data to an external API
        try {
            $externalResponse = Http::post('http://172.16.12.111:8014/syncSiteTransactions', [
                'transaction' => $closePeriodData,
            ]);

            if ($externalResponse->failed()) {
                Log::error('Failed to send transaction data to external API', [
                    'response' => $externalResponse->body(),
                ]);

                return response()->json([
                    'statusCode' => 0,
                    'statusDescription' => 'Failed to send data to external API',
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Exception occurred while sending transaction data to external API', [
                'exception' => $e->getMessage(),
            ]);

            return response()->json([
                'statusCode' => 0,
                'statusDescription' => 'Error while sending data to external API',
            ]);
        }

        // Return success response after external API call
        return response()->json([
            'statusCode' => 1,
            'statusDescription' => 'Period closed and data sent successfully',
        ]);
    }


    public function getAllPeriod(Request $request, Period $period)
    {
        $posID = 1;
        $periodType = $request->input('periodType');
        $periods = $period->getAllPeriod($periodType);

        if ($periods->isEmpty()) {
            return response()->json([
                'statusCode' => 0,
                'statusDescription' => 'Failed to retrieve periods'
            ]);
        }

        // Prepare the data to include period reports
        $periodReports = [];

        // Iterate over each period and get its report
        foreach ($periods as $periodItem) {
            $periodID = $periodItem->Period_ID;
            $reportData = $period->getPeriodReport($periodID, $posID);

            // Include the report in the response
            $periodReports[] = [
                'period' => $periodItem,
                'report' => $reportData['data'] ?? [],
                'result' => $reportData["result"] ?? 0
            ];
        }

        return response()->json([
            'statusCode' => 1,
            'statusDescription' => 'Success',
            'data' => $periodReports
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

    public function closeCDrawPeriod(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'posID' => 'required|integer',
        ]);

        // Get the logged-in cashier
        $cashier = Auth::user();

        if (!$cashier) {
            return response()->json(['error' => 'Cashier not authenticated'], 401);
        }

        $cashierID = $cashier->Cashier_ID; // Get the cashier ID from the authenticated user
        $posID = $request->input('posID');

        // Call the closeCashDraw method in the CashDrawPeriod model
        $returnData = (new CashDrawPeriod())->closeCashDraw($cashierID, $posID);

        if (!$returnData['result']) {
            return response()->json([
                "statusCode" => 0,
                "statusDescription" => $returnData['message'], // Provide the error message from the model
            ]);
        }

        // Directly call openCashDrawer method
        $printerController = new PrinterController();
        $openCashDrawerResponse = $printerController->openCashDrawer(new Request());

        return response()->json([
            "statusCode" => 1,
            "statusDescription" => "Success",
            "drawerStatus" => $openCashDrawerResponse->getOriginalContent() // Include drawer status in response
        ]);
    }
}
