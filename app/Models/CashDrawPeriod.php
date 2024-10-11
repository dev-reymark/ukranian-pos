<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CashDrawPeriod extends Model
{
    protected $table = 'CashDraw_Periods';
    protected $primaryKey = 'CDraw_Period_ID';
    public $timestamps = false;

    protected $fillable = [
        'Cashier_ID',
        'POS_ID',
        'CDraw_Open_Date',
        'CDraw_Close_Date',
        'CDraw_Period_state',
    ];

    public function cashier()
    {
        return $this->belongsTo(Cashier::class, 'Cashier_ID', 'Cashier_ID');
    }

    public function closeCashDraw($cashierID, $posID)
    {
        $cdrawPeriodID = $this->getActiveCdrwPeriod($cashierID, $posID);

        if ($cdrawPeriodID === false) {
            return ["result" => 0, "message" => "No active cash drawer found"];
        }

        $result = $this->closeCDrawPeriodSP($cashierID, $posID);

        if (!$result) {
            return ["result" => 0, "message" => "Failed to close period"];
        }

        return $this->getCDrawHistByCDPeriod($cdrawPeriodID);
    }

    public function getActiveCdrwPeriod($cashierID, $posID)
    {
        $result = $this->where('POS_ID', $posID)
            ->where('CDraw_Period_state', 1) // Assuming 1 means active
            ->first(['CDraw_Period_ID']); // Fetch only the primary key

        return $result ? $result->CDraw_Period_ID : false;
    }

    public function closeCDrawPeriodSP($cashierID, $posID)
    {
        DB::statement("EXEC SP_CLOSE_CDRAW_PERIOD @POS_ID = ?, @CASHIER_ID = ?", [$posID, $cashierID]);
        return true;
    }


    public function getCDrawHistByCDPeriod($cdrawPeriodID)
    {
        // Fetch cash draw history
        $cdrawHist = (new CashDrawHistory)->getCDrawHistByCDPeriod($cdrawPeriodID);

        if (!$cdrawHist) {
            return [
                "result" => 0,
                "message" => "No available cash draw history"
            ];
        }

        // Fetch manual cash draw grade history
        $manualHist = (new ManualCDrawGradeHistory)->getManualCDrawGradeHistByCDPeriodID($cdrawPeriodID);

        if (!$manualHist) {
            return [
                "result" => 0,
                "message" => "No available manual cash draw history"
            ];
        }

        // Fetch cash draw grade history
        $cdrawGradeHist = (new CDrawGradeHistory)->getCDrawGradeHistByCDPeriodID($cdrawPeriodID);

        if (!$cdrawGradeHist) {
            return [
                "result" => 0,
                "message" => "No available cash draw grade history"
            ];
        }

        // Fetch cash draw department history
        $cdrawDeptHist = (new CDrawDeptHistory)->getCDrawDeptHistByCDPeriodID($cdrawPeriodID);

        if (!$cdrawDeptHist) {
            return [
                "result" => 0,
                "message" => "No available cash draw department history"
            ];
        }

        // Fetch cash draw details
        $cdrawDetails = $this->getCashDrawDetails($cdrawPeriodID);

        if (!$cdrawDetails) {
            return [
                "result" => 0,
                "message" => "No available cash draw information"
            ];
        }

        // Compile all results into an array
        $data = [
            "cdrawFinHistory" => $cdrawHist,
            "cdrawGradeHist" => $cdrawGradeHist,
            "cdrawDeptHist" => $cdrawDeptHist,
            "cdrawDetails" => $cdrawDetails,
            "manualCdrawGradeHist" => $manualHist
        ];

        return [
            "result" => 1,
            "message" => "Success",
            "data" => $data
        ];
    }

    public function getCashDrawDetails($cdrawPeriodID)
    {
        // Perform the query with a join to the cashiers table
        $result = DB::table($this->table)
            ->select(
                'CashDraw_Periods.CDraw_Period_ID',
                'cashiers.Cashier_Name',
                'CashDraw_Periods.CDraw_Open_Date',
                'CashDraw_Periods.CDraw_Close_Date'
            )
            ->leftJoin('cashiers', 'cashiers.Cashier_ID', '=', 'CashDraw_Periods.Cashier_ID')
            ->where($this->primaryKey, $cdrawPeriodID) // Assuming $idCol corresponds to CDraw_Period_ID
            ->first(); // Use first() to get a single result

        // Check if the result is null
        if (is_null($result)) {
            return false; // No records found
        }

        // Prepare the data array to return
        $data = [
            "CDraw_Period_ID" => $result->CDraw_Period_ID,
            "Cashier_Name" => trim($result->Cashier_Name),
            "CDraw_Open_Date" => $result->CDraw_Open_Date,
            "CDraw_Close_Date" => $result->CDraw_Close_Date,
        ];

        return $data;
    }

    public function getAllCashDrawByPosID($posID)
    {
        $retData = $this->getAllCDrawByPosID($posID);

        if ($retData) {
            return [
                "result" => 1,
                "message" => "Success",
                "data" => $retData
            ];
        }

        return [
            "result" => 0,
            "message" => "Failed to get cashdraw list"
        ];
    }

    public function getAllCDrawByPosID($posID)
    {
        // Use Eloquent to fetch the data
        $result = CashDrawPeriod::with('cashier') // Eager load cashier relationship
            ->where('POS_ID', $posID) // Use the actual column name for POS_ID
            ->orderBy('CDraw_Close_Date', 'desc') // Use the actual column name for CDraw_Close_Date
            ->get(['CDraw_Period_ID', 'Cashier_ID', 'CDraw_Close_Date']); // Ensure these column names are correct

        if ($result->isEmpty()) {
            return false;
        }

        return $result->map(function ($cdraw) {
            return [
                "CDraw_Period_ID" => $cdraw->CDraw_Period_ID,
                "Cashier_Name" => optional($cdraw->cashier)->Cashier_Name, // Use optional to avoid errors if cashier is not found
                "CDraw_Close_Date" => $cdraw->CDraw_Close_Date // Ensure this matches your actual column name
            ];
        })->toArray();
    }

    public function getCashdrawSafedropDetails($cashdrawPeriodID)
    {
        $retData = (new CashDrawHistory)->getCashdrawSafedropDetails($cashdrawPeriodID);

        if ($retData) {
            return [
                'result' => 1,
                'message' => 'Success',
                'data' => $retData->CDraw_Num_Safedrop,
            ];
        }

        return [
            'result' => 0,
            'message' => 'No safedrop details available',
        ];
    }
}
