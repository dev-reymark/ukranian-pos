<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CashierHistory extends Model
{
    protected $table = 'Cashier_History';
    protected $primaryKey = 'Cashier_ID';
    public $timestamps = false;

    protected $fillable = [
        'Cashier_ID',
        'Period_ID',
        'Cshr_Num_Trs',
        'Cshr_Val_Trs',
        'Cshr_Num_Void',
        'Cshr_Val_Void',
        'Cshr_Num_NoSales',
        'Cshr_Num_Refund',
        'Cshr_Val_Refund',
    ];

    public function getCashierTotalByPeriod($periodID)
    {
        return DB::table($this->table)
            ->select(
                "{$this->table}.Cashier_ID",
                "Cashiers.Cashier_Name",
                "{$this->table}.Period_ID",
                "{$this->table}.Cshr_Num_Trs",
                "{$this->table}.Cshr_Val_Trs",
                "{$this->table}.Cshr_Num_Void",
                "{$this->table}.Cshr_Val_Void",
                "{$this->table}.Cshr_Num_NoSales",
                "{$this->table}.Cshr_Num_Refund",
                "{$this->table}.Cshr_Val_Refund"
            )
            ->join("Cashiers", "Cashiers.Cashier_ID", "=", "{$this->table}.Cashier_ID")
            ->where("{$this->table}.Period_ID", $periodID)
            ->get();
    }

    public function updateCashierHistTrans($cashierID, $transVal)
    {
        $add = $transVal > 0 ? 1 : 0;

        $updated = DB::table('CASHIER_HISTORY')
            ->join('PERIODS as P', 'CASHIER_HISTORY.PERIOD_ID', '=', 'P.PERIOD_ID')
            ->where('CASHIER_HISTORY.CASHIER_ID', $cashierID)
            ->where('P.PERIOD_STATE', 1)
            ->update([
                'CSHR_NUM_TRS' => DB::raw('CSHR_NUM_TRS + ' . $add),
                'CSHR_VAL_TRS' => DB::raw('CSHR_VAL_TRS + ' . $transVal),
            ]);

        return $updated > 0; // Return true if at least one row was updated, otherwise false
    }

    public function updateCashierHistRefund($transID, $transRefund)
    {
        $transRefundNegative = abs($transRefund) * -1;

        $updated = DB::table('CASHIER_HISTORY as CH')
            ->join('PERIODS as P', 'CH.PERIOD_ID', '=', 'P.PERIOD_ID')
            ->join('TRANSACTIONS as T', 'CH.CASHIER_ID', '=', 'T.CASHIER_ID')
            ->where('P.PERIOD_STATE', 1)
            ->where('T.TRANSACTION_ID', $transID)
            ->update([
                'Cshr_Num_Trs' => DB::raw('Cshr_Num_Trs - 1'),
                'Cshr_Val_Trs' => DB::raw('Cshr_Val_Trs - ' . $transRefund),
                'CSHR_NUM_REFUND' => DB::raw('CSHR_NUM_REFUND + 1'),
                'CSHR_VAL_REFUND' => DB::raw('CSHR_VAL_REFUND + ' . $transRefundNegative),
            ]);

        return $updated > 0; // Return true if at least one row was updated, otherwise false
    }
}
