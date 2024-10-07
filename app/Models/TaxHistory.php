<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class TaxHistory extends Model
{
    protected $table = 'Tax_History';
    protected $primaryKey = 'Tax_ID';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'Tax_ID',
        'Period_ID',
        'Tax_Tot_Value',
        'Tax_Sale_Value',
        'Tax_Discount_Value',
        'Tax_Refund_Value',
        'Tax_SeniorPWDDisc_Sale_Value',
        'Tax_SeniorPWDDisc_Discount_Value',
        'Tax_SeniorPWDDisc_Refund_Value',
        'Tax_NonTaxable_Discount',
    ];

    // Define a relationship with the Taxes model
    public function tax()
    {
        return $this->belongsTo(Tax::class, 'Tax_ID', 'Tax_ID');
    }
    public function getTaxHistoryByPeriodID($periodID)
    {
        return DB::table('Tax_History')
            ->join('Taxes', 'Taxes.Tax_ID', '=', 'Tax_History.Tax_ID')
            ->where('Tax_History.Period_ID', $periodID)
            ->select('Tax_History.Tax_ID', DB::raw('LTRIM(RTRIM(Taxes.Tax_Name)) as Tax_Name'), 'Tax_History.Period_ID', 'Tax_Tot_Value', 'Tax_Sale_Value')
            ->get();
    }
}
