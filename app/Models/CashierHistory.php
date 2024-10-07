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
}
