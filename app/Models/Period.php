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

        if (!$result) {
            return ['result' => 0, 'message' => 'Failed to close period'];
        }

        return ['result' => 1, 'message' => 'Success'];
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


    public function getPeriodReport($periodID, $posID)
    {
        // Fetch period details using the model's method
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
        // $deptDiscounts = $this->Department_History_DB->getDepartmentDiscounts($periodID);
        // $manualFuelSalesDisc = $this->Manual_Hose_History_DB->getFuelDiscount($periodID);
        // $fuelSalesDisc = $this->Hose_History_DB->getFuelSalesDisc($periodID);
        // $discountTotal = $this->Discount_History_DB->getDiscountTotal($periodID);
        // $depRefund = $this->Department_History_DB->getDepartmentRefund($periodID);
        // $transHourData = $this->Transaction_DB->getTransHistHourData($periodID);
        // $hoseHistData = $this->Hose_History_DB->getHoseHistData($periodID);
        // $tankHistData = $this->Tank_History_DB->getTankHistData($periodID);
        // $attendantDeliveries = $this->Transaction_DB->getAttendantDeliveries($periodID);
        // $vehicleReports = $this->Transaction_Item_DB->getVehicleCountReport($periodID);

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
            // "deliveryTaxExempt" => $gradeTaxExempt,
            "taxHistory" => $taxHistory,
            // "deptDiscounts" => $deptDiscounts,
            // "manualFuelSalesDisc" => $manualFuelSalesDisc,
            // "fuelSalesDisc" => $fuelSalesDisc,
            // "discountTotal" => $discountTotal,
            // "depRefund" => $depRefund,
            // "transHourData" => $transHourData,
            // "hoseHistData" => $hoseHistData,
            // "tankHistData" => $tankHistData,
            "transNums" => $transNums,
            // "attendantDeliveries" => $attendantDeliveries,
            // "vehicleCountReport" => $vehicleReports,
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
}
