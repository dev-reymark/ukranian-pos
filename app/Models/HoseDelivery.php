<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class HoseDelivery extends Model
{

    protected $table = 'Hose_Delivery';
    public $timestamps = false;
    protected $primaryKey = 'Delivery_ID';
    public $incrementing = false;

    protected $fillable = [
        'Hose_ID',
        'Pump_ID',
        'Attendant_ID',
        'Price_Level',
        'Completed_TS',
        'Cleared_Date_Time',
        'Delivery_Type',
        'Delivery_State',
        'Delivery_Volume',
        'Delivery_Value',
        'Del_Sell_Price',
        'Del_Cost_Price',
        'Cleared_By',
        'Reserved_By',
        'Transaction_ID',
        'Del_Item_Number',
        'Delivery2_Volume',
        'Hose_Meter_Volume',
        'Hose_Meter_Value',
        'Hose_Meter_Volume2',
        'Hose_Meter_Value2',
        'Blend_Ratio',
        'Previous_Delivery_Type',
        'Auth_Ref',
        'Delivery1_Volume',
        'Delivery1_Value',
        'Delivery2_Value',
        'Hose_Meter_Volume1',
        'Hose_Meter_Value1',
        'Grade1_Price',
        'Grade2_Price',
        'Is_Sold',
        'FuelGradeName',
        'FuelGradePrice',
    ];

    protected $casts = [
        'Delivery_Volume' => 'float',
        'Del_Cost_Price' => 'float',
        'Delivery_Value' => 'float',
    ];

    public function hose()
    {
        return $this->belongsTo(Hose::class, 'Hose_ID', 'Hose_ID');
    }
}
