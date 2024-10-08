<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashDrawHistory extends Model
{
    use HasFactory;

    protected $table = 'CashDraw_History';
    protected $primaryKey = 'MOP_ID';
    public $timestamps = false;

    protected $fillable = [
        'CDraw_Period_ID',
        'CDraw_Tot_Amount',
        'CDraw_Float',
        'CDraw_Num_Safedrop',
        'CDraw_Tot_Safedrop',
        'CDraw_Num_Payin',
        'CDraw_Tot_Payin',
        'CDraw_Num_CashOut',
        'CDraw_Tot_CashOut',
        'CDraw_Num_Refund',
        'CDraw_Tot_Refund',
    ];

    public function getCDrawHistByCDPeriod($cdPeriodID)
    {
        $result = CashDrawHistory::select(
            'CashDraw_History.MOP_ID',
            'Finalisations.MOP_Name',
            'CashDraw_History.CDraw_Tot_Amount',
            'CashDraw_History.CDraw_Float',
            'CashDraw_History.CDraw_Num_Safedrop',
            'CashDraw_History.CDraw_Tot_Safedrop',
            'CashDraw_History.CDraw_Num_Payin',
            'CashDraw_History.CDraw_Tot_Payin',
            'CashDraw_History.CDraw_Num_CashOut',
            'CashDraw_History.CDraw_Tot_CashOut',
            'CashDraw_History.CDraw_Num_Refund',
            'CashDraw_History.CDraw_Tot_Refund'
        )
            ->leftJoin('Finalisations', 'Finalisations.MOP_ID', '=', 'CashDraw_History.MOP_ID')
            ->where('CashDraw_History.CDraw_Period_ID', $cdPeriodID) // Use the appropriate column name
            ->get();

        return $result->isEmpty() ? false : $result;
    }
}
