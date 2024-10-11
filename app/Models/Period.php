<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Period extends Model
{
    protected $table = 'Periods';
    protected $primaryKey = 'Period_ID';
    public $timestamps = false;

    protected $fillable = [
        'Period_Create_TS',
        'Period_Type',
        'Period_Close_DT',
        'Period_State',
        'Period_Name',
        'Period_Number',
        'Shift_number',
        'Tank_Dips_Entered',
        'Tank_Drops_Entered',
        'Pump_Meter_Entered',
        'Exported',
        'Export_Required',
        'WetStock_Out_Of_Variance',
        'WetStock_Approval_ID',
        'BeginningSI',
        'EndingSI'
    ];

    public function departmentHistories()
    {
        return $this->hasMany(DepartmentHistory::class, 'Period_ID', 'Period_ID');
    }

    public function getCashierActiveShiftPeriod($cashierID)
    {
        return $this->join('Cashier_History', 'Cashier_History.Period_ID', '=', 'Periods.Period_ID')
            ->where([
                ['Cashier_History.Cashier_ID', '=', $cashierID],
                ['Periods.Period_Type', '=', 1],
                ['Periods.Period_State', '=', 1]
            ])
            ->select('Periods.Period_ID', 'Shift_number')
            ->first();
    }

    public function closePeriod($periodType)
    {
        // Call stored procedure
        $result = $this->closePeriodSP($periodType);

        $periodDetails = $this->where('Period_Type', $periodType)
            ->orderBy('Period_Close_DT', 'desc')
            ->first();

        if (!$result) {
            return ['result' => 0, 'message' => 'Failed to close period'];
        }

        return ['result' => 1, 'message' => 'Success', 'periodDetails' => $periodDetails];
    }

    public function closePeriodSP($periodType)
    {
        $result = DB::statement("EXEC SP_CLOSE_POS_PERIOD @period_type = ?", [$periodType]);

        return $result;
    }

    public function getAllPeriod($type = null)
    {
        $query = $this->select('Period_ID', 'Period_Create_TS', 'Period_Type', 'Period_Close_DT', 'Shift_number');

        if ($type !== null) {
            $query->where('Period_Type', $type);
        }

        return $query->get();
    }

    public function getAllActivePeriod()
    {
        $results = DB::table($this->table)
            ->select('Period_ID as periodID')
            ->where($this->stateCol, 1)
            ->get(); // Use get() to retrieve all matching records

        return $results->isNotEmpty() ? $results : false; // Return results or false if empty
    }


    public function getPeriodReport($periodID, $posID)
    {
        $periodDetails = $this->getPeriodDetails($periodID);

        if (!$periodDetails) {
            return ["result" => 0, "message" => "Period details not found"];
        }

        $depSales = (new DepartmentHistory)->getDepartmentSales($periodID);
        $fuelSales = (new HoseHistory)->getFuelSales($periodID);
        $manualFuelSales = (new ManualHoseHistory)->getFuelSales($periodID);
        $accDiscSales = (new FinalisationHistory)->getAccDiscSales($periodID);
        $finHistory = (new FinalisationHistory)->getFinalisationTotals($periodID);
        $cashiersTotal = (new CashierHistory)->getCashierTotalByPeriod($periodID);
        $transNums = (new PosPeriodBIRTransNum)->getTransNums($periodID);
        $depTaxExempt = (new DepartmentHistory)->getDepartmentTaxExempt($periodID);
        $gradeTaxExempt = (new PosGradeHistory)->getGradeTaxExempt($periodID);
        $taxHistory = (new TaxHistory)->getTaxHistoryByPeriodID($periodID);
        $deptDiscounts = (new DepartmentHistory)->getDepartmentDiscounts($periodID);
        $manualFuelSalesDisc = (new ManualHoseHistory)->getFuelDiscount($periodID);
        $fuelSalesDisc = (new HoseHistory)->getFuelSalesDisc($periodID);
        $discountTotal = (new DiscountHistory)->getDiscountTotal($periodID);
        $depRefund = (new DepartmentHistory)->getDepartmentRefund($periodID);
        $transHourData = (new Transaction)->getTransHistHourData($periodID);
        $hoseHistData = (new HoseHistory)->getHoseHistData($periodID);
        $tankHistData = (new TankHistory)->getTankHistData($periodID);
        $attendantDeliveries = (new Transaction)->getAttendantDeliveries($periodID);
        $vehicleReports = (new TransactionItem)->getVehicleCountReport($periodID);

        // Prepare data for response
        $data = [
            "depSales" => $depSales,
            "fuelSales" => $fuelSales,
            "accDiscSales" => $accDiscSales,
            "finHistory" => $finHistory,
            "cashiersTotal" => $cashiersTotal,
            "periodDetails" => $periodDetails,
            "manualFuelSales" => $manualFuelSales,
            "deptTaxExempt" => $depTaxExempt,
            "gradeTaxExempt" => $gradeTaxExempt,
            "deliveryTaxExempt" => $gradeTaxExempt,
            "taxHistory" => $taxHistory,
            "deptDiscounts" => $deptDiscounts,
            "manualFuelSalesDisc" => $manualFuelSalesDisc,
            "fuelSalesDisc" => $fuelSalesDisc,
            "discountTotal" => $discountTotal,
            "depRefund" => $depRefund,
            "transHourData" => $transHourData,
            "hoseHistData" => $hoseHistData,
            "tankHistData" => $tankHistData,
            "transNums" => $transNums,
            "attendantDeliveries" => $attendantDeliveries,
            "vehicleCountReport" => $vehicleReports,
        ];

        return ["result" => 1, "message" => "Success", "data" => $data];
    }

    public function getPeriodDetails($periodID)
    {
        $result = $this->where('Period_ID', $periodID)
            ->select('Period_ID', 'Period_Create_TS', 'Period_Close_DT')
            ->first();

        if (is_null($result)) {
            return false;
        }

        return $result;
    }

    public function getActiveShiftPeriod(): ?int
    {
        // Define column names
        $this->idCol = 'Period_ID';
        $this->typeCol = 'Period_Type';
        $this->stateCol = 'Period_State';

        // Use Eloquent to find the active shift period
        $result = $this->where($this->typeCol, 1)
            ->where($this->stateCol, 1)
            ->select($this->idCol)
            ->first(); // Get the first matching record

        // Return Period_ID or null if not found
        return $result->Period_ID ?? null;
    }
}
