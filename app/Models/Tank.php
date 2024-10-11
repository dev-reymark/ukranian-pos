<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tank extends Model
{
    use HasFactory;

    protected $table = 'Tanks';
    public $timestamps = false;
    protected $primaryKey = 'Tank_ID';
    public $incrementing = true;

    protected $fillable = [
        'Grade_ID',
        'Tank_Name',
        'Tank_Number',
        'Tank_Description',
        'Capacity',
        'Gauge_Level',
        'Temperature',
        'Gauge_TC_Volume',
        'Water_Level',
        'Dip_Level',
        'Gauge_Volume',
        'Theoretical_Volume',
        'Dip_Volume',
        'Average_Cost',
        'Strapped_Tank_ID',
        'Ullage',
        'Water_Volume',
        'Gauge_alarms',
        'Diameter',
        'Low_Volume_Warning',
        'Low_Volume_Alarm',
        'Hi_Volume_Warning',
        'Hi_Volume_Alarm',
        'Hi_Water_Alarm',
        'Probe_Number',
        'Density',
        'Tank_Gauge_ID',
        'Tank_Type_ID',
        'Tank_Connection_Type_ID',
        'Tank_Probe_Status_ID',
        'Tank_Readings_DT',
        'Tank_Delivery_State_ID',
        'Pump_Delivery_State',
        'Hi_Temperature',
        'Low_Temperature',
        'Physical_Label',
        'Loss_Tolerance_Vol',
        'Gain_Tolerance_Vol',
        'Deleted',
        'Auto_Disable',
        'Is_Enabled',
    ];

}
