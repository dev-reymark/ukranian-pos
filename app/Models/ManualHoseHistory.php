<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ManualHoseHistory extends Model
{
    protected $table = 'Manual_Hose_History';
    protected $primaryKey = 'Hose_ID';
    public $timestamps = false;

    protected $fillable = [
        'Hose_ID',
        'Period_ID',
        'Postpay_Quantity',
        'Postpay_Value',
        'Postpay_Volume',
        'hose_vol_disc',
        'hose_val_disc',
        'hose_qty_disc',
        'hose_vol_ref',
        'hose_val_ref',
        'hose_qty_ref',
        'tax_exempt_vol',
        'tax_exempt_val',
        'tax_exempt_vol_ref',
        'tax_exempt_val_ref'
    ];

    public function getFuelSales($periodID)
    {
        return $this->selectRaw("LTRIM(RTRIM(Grades.Grade_Name)) as Grade_Name, SUM(Postpay_Quantity) as postPayQty, SUM(Postpay_Volume) as postPayVol, SUM(Postpay_Value) as postPayVal")
            ->leftJoin("Hoses", "Hoses.Hose_ID", "=", "Manual_Hose_History.Hose_ID")
            ->leftJoin("Grades", "Grades.Grade_ID", "=", "Hoses.Grade_ID")
            ->where("Manual_Hose_History.Period_ID", $periodID)
            ->groupBy("Hoses.Grade_ID", "Grades.Grade_Name")
            ->get();

        if ($result) {
            return $list;
        }

        return false;
    }

    public function getFuelDiscount($periodID)
    {
        // Query to get the fuel discounts
        $list = DB::table('Manual_Hose_History')
            ->select(
                DB::raw("LTRIM(RTRIM(Grades.Grade_Name)) as Grade_Name"),
                DB::raw("SUM(hose_vol_disc) as hoseVolDisc"),
                DB::raw("SUM(hose_val_disc) as hoseValDisc"),
                DB::raw("ABS(SUM(hose_qty_disc)) as hoseQtyDisc")
            )
            ->where('Period_ID', $periodID)
            ->leftJoin('Hoses', 'Hoses.Hose_ID', '=', 'Manual_Hose_History.Hose_ID')
            ->leftJoin('Grades', 'Grades.Grade_ID', '=', 'Hoses.Grade_ID')
            ->groupBy('Hoses.Grade_ID', 'Grades.Grade_Name')
            ->get();

        // Check if results were returned
        if ($list->isNotEmpty()) {
            return $list;
        }

        return false;
    }
}
