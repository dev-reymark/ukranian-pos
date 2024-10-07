<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinalisationHistory extends Model
{
    protected $table = 'Finalisation_History';
    protected $primaryKey = 'MOP_ID';
    public $timestamps = false;

    protected $fillable = [
        'MOP_ID',
        'Period_ID',
        'MOP_Net_Qty',
        'MOP_Net_Value',
        'MOP_Num_Safedrop',
        'MOP_Val_Safedrop',
        'MOP_Num_Payin',
        'MOP_Val_Payin',
        'MOP_Num_Cashout',
        'MOP_Val_Cashout',
        'MOP_val_CashAdj'
    ];

    public function getAccDiscSales($periodID)
    {
        $accDiscSales = $this->where('Period_ID', $periodID)
            ->sum('MOP_Val_Cashout');

        $depSales = [
            'qty' => $accDiscSales
        ];

        return $depSales;
    }

    public function finalisation()
    {
        return $this->belongsTo(Finalisation::class, 'MOP_ID', 'MOP_ID');
    }

    public function getFinalisationTotals($periodID)
    {
        // Fetch totals with the necessary joins using Eloquent
        $finHistTotals = $this->with('finalisation') // Use the relationship defined in FinalisationHistory model
            ->where('Period_ID', $periodID)
            ->select(
                'Finalisation_History.MOP_ID',
                'Finalisations.MOP_Name',
                'MOP_Net_Qty',
                'MOP_Net_Value',
                'MOP_Num_Safedrop',
                'MOP_Val_Safedrop',
                'MOP_Num_Cashout',
                'MOP_Val_Cashout'
            )
            ->leftJoin('Finalisations', 'Finalisations.MOP_ID', '=', 'Finalisation_History.MOP_ID')
            ->get();

        // Prepare the response array
        $fHistories = $finHistTotals->map(function ($item) {
            return (object)[
                'id' => $item->MOP_ID,
                'name' => trim($item->MOP_Name),
                'netQty' => $item->MOP_Net_Qty,
                'netValue' => $item->MOP_Net_Value,
                'numSafedrop' => $item->MOP_Num_Safedrop,
                'valSafedrop' => $item->MOP_Val_Safedrop,
                'numCashout' => $item->MOP_Num_Cashout,
                'valCashout' => $item->MOP_Val_Cashout,
            ];
        });

        return $fHistories; // Return as a collection of objects
    }
}
