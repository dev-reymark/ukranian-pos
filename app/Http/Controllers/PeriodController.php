<?php

namespace App\Http\Controllers;

use App\Models\CashDrawPeriod;
use App\Models\Period;
use DateTime;
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

        // Log the returnCloseData to check its contents
        Log::info('Return Close Data:', $returnCloseData);

        // Convert period_create_ts and period_close_dt to Clarion date and time
        $periodDetails = $returnCloseData['periodDetails'];

        if ($periodDetails) {
            $periodCreateTs = new DateTime($periodDetails['Period_Create_TS']);
            $periodCloseDt = new DateTime($periodDetails['Period_Close_DT']);

            // Clarion epoch start date (1800-12-28)
            $clarionEpoch = new DateTime('1800-12-28');
            $clarionEpochTimestamp = $clarionEpoch->getTimestamp();

            // Convert Period_Create_TS to Clarion date and time
            $periodCreateClarionDate = $this->convertToClarionDate($periodCreateTs, $clarionEpochTimestamp);
            $periodCreateClarionTime = $this->convertToClarionTime($periodCreateTs);

            // Convert Period_Close_DT to Clarion date and time
            $periodCloseClarionDate = $this->convertToClarionDate($periodCloseDt, $clarionEpochTimestamp);
            $periodCloseClarionTime = $this->convertToClarionTime($periodCloseDt);
        }

        // Prepare the data for the external API
        $closePeriodData = [
            'SitePeriods' => [
                [
                    'branchid' => 1,
                    'period_id' => $periodDetails['Period_ID'],
                    'period_create_ts' => $periodDetails['Period_Create_TS'],
                    'period_create_ts_group' => [
                        'period_create_ts_date' => $periodCreateClarionDate,
                        'period_create_ts_time' => $periodCreateClarionTime,
                    ],
                    'period_type' => $periodType,
                    'period_close_dt' => $periodDetails['Period_Close_DT'],
                    'period_close_dt_group' => [
                        'period_close_dt_date' => $periodCloseClarionDate,
                        'period_close_dt_time' => $periodCloseClarionTime,
                    ],
                    'period_state' => $periodDetails['Period_State'],
                    'period_number' => $periodDetails['Period_Number'],
                    'shift_number' => $periodDetails['Shift_number'],
                    'tank_dips_entered' => $periodDetails['Tank_Dips_Entered'],
                    'tank_drops_entered' => $periodDetails['Tank_Drops_Entered'],
                    'pump_meter_entered' => $periodDetails['Pump_Meter_Entered'],
                    'exported' => $periodDetails['Exported'],
                    'export_required' => $periodDetails['Export_Required'],
                    'wetstock_out_of_variance' => $periodDetails['WetStock_Out_Of_Variance'],
                    'wetstock_approval_id' => $periodDetails['WetStock_Approval_ID'],
                    'beginningsi' => $periodDetails['BeginningSI'],
                    'endingsi' => $periodDetails['EndingSI'],
                ]
            ],
            'SitePeriods_Action' => 'insert',
            'skiprecords' => 0,
            'maxrecords' => 100,
        ];

        // Log the transaction data before sending it to the external API
        Log::info('Sending transaction data to external API', ['transactionData' => $closePeriodData]);

        // Send the serialized transaction data to an external API
        try {
            $externalResponse = Http::post('http://172.16.12.111:8014/syncSitePeriods', [
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
    }

    /**
     * Convert a given DateTime to a Clarion date.
     */
    private function convertToClarionDate($dateTime, $clarionEpochTimestamp)
    {
        $dateTimeTimestamp = $dateTime->getTimestamp();
        $clarionDate = floor(($dateTimeTimestamp - $clarionEpochTimestamp) / (60 * 60 * 24)) + 1;
        return $clarionDate;
    }

    /**
     * Convert a given DateTime to a Clarion time.
     */
    private function convertToClarionTime($dateTime)
    {
        $timePart = $dateTime->format('H:i:s');
        $timeParts = explode(':', $timePart);

        $hours = isset($timeParts[0]) ? (int) $timeParts[0] : 0;
        $minutes = isset($timeParts[1]) ? (int) $timeParts[1] : 0;
        $seconds = isset($timeParts[2]) ? (int) $timeParts[2] : 0;

        // Calculate total seconds since midnight
        $totalSecondsSinceMidnight = ($hours * 3600) + ($minutes * 60) + $seconds;

        // Convert total seconds into ticks (100 ticks = 1 second)
        $clarionTime = $totalSecondsSinceMidnight * 100;
        return $clarionTime;
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
