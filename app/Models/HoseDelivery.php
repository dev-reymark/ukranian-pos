<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HoseDelivery extends Model
{

    protected $table = 'Hose_Delivery';

    protected $primaryKey = 'Delivery_ID';

    protected $fillable = [
        'Hose_ID',
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
    ];
}
