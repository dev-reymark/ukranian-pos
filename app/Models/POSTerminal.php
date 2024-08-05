<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class POSTerminal extends Model
{
    use HasFactory;

    protected $table = 'POS_Terminal';

    protected $primaryKey = 'POS_ID';

    public $timestamps = false;

    protected $fillable = [
        'POS_Number',
        'POS_Master',
        'POS_Trans_Number',
        'POS_Training_Mode',
        'Receipt_ID',
        'Display_ID',
        'BIR_Fuel_Receipt_ID',
        'BIR_Non_Fuel_Receipt_ID',
        'BIR_Fuel_Trans_Number',
        'BIR_Non_Fuel_Trans_Number',
        'gt_open_date',
        'last_bir_fuel_trans_number',
        'last_bir_non_fuel_trans_number',
        'temp_bir_fuel_trans_number',
        'temp_bir_non_fuel_trans_number',
        'ZCounter',
        'BIR_Reset_Counter',
        'Non_BIR_Trans_Number',
        'Non_BIR_Trans_Number_Reset_Counter',
        'last_bir_resetter',
        'temp_bir_resetter'
    ];

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'POS_ID', 'POS_ID');
    }
}
