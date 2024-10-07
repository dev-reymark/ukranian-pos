<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class HoseHistory extends Model
{
    protected $table = 'Hose_History';
    protected $primaryKey = 'Hose_ID';
    public $timestamps = false;

    protected $fillable = [
        'Hose_ID',
        'Period_ID',
        'Open_Meter_Value',
        'Close_Meter_Value',
        'Postpay_Quantity',
        'Open_Meter_Volume',
        'Postpay_Value',
        'Close_Meter_Volume',
        'Postpay_Volume',
        'Postpay_Cost',
        'Prepay_Quantity',
        'Prepay_Value',
        'Prepay_Volume',
        'Prepay_Cost',
        'Prepay_Refund_Qty',
        'Prepay_Refund_Val',
        'Preauth_Quantity',
        'Prepay_Rfd_Lst_Qty',
        'Preauth_Value',
        'Prepay_Rfd_Lst_Val',
        'Preauth_Volume',
        'Preauth_Cost',
        'Monitor_Quantity',
        'Monitor_Value',
        'Monitor_Volume',
        'Monitor_Cost',
        'Driveoffs_Quantity',
        'Driveoffs_Value',
        'Driveoffs_Volume',
        'Driveoffs_Cost',
        'Test_Del_Quantity',
        'Test_Del_Volume',
        'Offline_Quantity',
        'Offline_Volume',
        'Offline_Value',
        'Offline_Cost',
        'Open_Mech_Volume',
        'Close_Mech_Volume',
        'Open_Volume_Turnover_Correction',
        'Open_Money_Turnover_Correction',
        'Close_Volume_Turnover_Correction',
        'Close_Money_Turnover_Correction',
        'Open_Volume_Turnover_Correction2',
        'Close_Volume_Turnover_Correction2',
        'hose_vol_disc',
        'hose_val_disc',
        'hose_qty_disc'
    ];

    public function getFuelSales($periodID)
    {
        $results = DB::table('Hose_History')
            ->selectRaw("
            Grades.Grade_Name,
            SUM(Hose_History.Postpay_Quantity) as postPayQty,
            SUM(Hose_History.Postpay_Volume) as postPayVol,
            SUM(Hose_History.Postpay_Value) as postPayVal,
            SUM(Hose_History.Test_Del_Quantity) as testDelQty,
            SUM(Hose_History.Test_Del_Volume) as testDelVol,
            SUM(Hose_History.Offline_Quantity) as offQty,
            SUM(Hose_History.Offline_Volume) as offVol,
            SUM(Hose_History.Offline_Value) as offVal,
            SUM(Hose_History.Driveoffs_Quantity) as driveOffQty,
            SUM(Hose_History.Driveoffs_Value) as driveOffVal,
            SUM(Hose_History.Driveoffs_Volume) as driveOffVol,
            SUM(Hose_History.Driveoffs_Cost) as driveOffCost,
            SUM(Hose_History.Monitor_Quantity) as monitorQty,
            SUM(Hose_History.Monitor_Value) as monitorVal,
            SUM(Hose_History.Monitor_Volume) as monitorVol,
            SUM(Hose_History.Monitor_Cost) as monitorCost
        ")
            ->join('Hoses', 'Hoses.Hose_ID', '=', 'Hose_History.Hose_ID', 'left')
            ->join('Grades', 'Grades.Grade_ID', '=', 'Hoses.Grade_ID', 'left')
            ->where('Hose_History.Period_ID', $periodID)
            ->groupBy('Hoses.Grade_ID', 'Grades.Grade_Name')
            ->get();

        // If there are no results, return false
        if ($results->isEmpty()) {
            return false;
        }

        // Process the results and map to FuelSales objects (if using a FuelSales class)
        $listArr = [];

        foreach ($results as $result) {
            $fuelSales = new \stdClass(); // or FuelSales if you have a class for it

            $fuelSales->Grade_Name = trim($result->Grade_Name);
            $fuelSales->postPayQty = $result->postPayQty;
            $fuelSales->postPayVol = $result->postPayVol;
            $fuelSales->postPayVal = $result->postPayVal;
            $fuelSales->testDelQty = $result->testDelQty;
            $fuelSales->testDelVol = $result->testDelVol;
            $fuelSales->offQty = $result->offQty;
            $fuelSales->offVol = $result->offVol;
            $fuelSales->offVal = $result->offVal;
            $fuelSales->driveOffQty = $result->driveOffQty;
            $fuelSales->driveOffVal = $result->driveOffVal;
            $fuelSales->driveOffVol = $result->driveOffVol;
            $fuelSales->driveOffCost = $result->driveOffCost;
            $fuelSales->monitorQty = $result->monitorQty;
            $fuelSales->monitorVal = $result->monitorVal;
            $fuelSales->monitorVol = $result->monitorVol;
            $fuelSales->monitorCost = $result->monitorCost;

            $listArr[] = $fuelSales;
        }

        return $listArr;
    }
    public function getFuelSalesDisc($periodID)
    {
        $result = DB::table('Hose_History')
            ->selectRaw("LTRIM(RTRIM(Grades.Grade_Name)) as Grade_Name, ABS(SUM(Hose_History.hose_vol_disc)) as hoseVolDisc, SUM(Hose_History.hose_val_disc) as hoseValDisc, SUM(Hose_History.hose_qty_disc) as hoseQtyDisc")
            ->join('Hoses', 'Hoses.Hose_ID', '=', 'Hose_History.Hose_ID', 'left')
            ->join('Grades', 'Grades.Grade_ID', '=', 'Hoses.Grade_ID', 'left')
            ->where('Hose_History.Period_ID', $periodID)
            ->groupBy('Hoses.Grade_ID', 'Grades.Grade_Name')
            ->get();

        if ($result->isNotEmpty()) {
            return $result;
        }

        return false;
    }
}
