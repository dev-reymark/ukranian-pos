<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TankHistory extends Model
{
    use HasFactory;

    protected $table = 'Tank_History';

    protected $fillable = [
        'Period_ID',
        'Tank_ID',
        'Open_Gauge_Volume',
        'Close_Gauge_Volume',
        'Open_Theo_Volume',
        'Close_Theo_Volume',
        'Open_Dip_Volume',
        'Close_Dip_Volume',
        'Hose_Del_Quantity',
        'Hose_Del_Volume',
        'Hose_Del_Value',
        'Hose_Del_Cost',
        'Tank_Del_Quantity',
        'Tank_Del_Volume',
        'Tank_Del_Cost',
        'Tank_Loss_Quantity',
        'Tank_Loss_Volume',
        'Tank_Transfer_In_Quantity',
        'Tank_Transfer_In_Volume',
        'Tank_Transfer_Out_Quantity',
        'Tank_Transfer_Out_Volume',
        'Dip_Fuel_Temp',
        'Dip_Fuel_Density',
        'Open_Dip_Water_Volume',
        'Close_Dip_Water_Volume',
        'Open_Gauge_TC_Volume',
        'Close_Gauge_TC_Volume',
        'Open_Water_Volume',
        'Close_Water_Volume',
        'Open_Fuel_Density',
        'Close_Fuel_Density',
        'Open_Fuel_Temp',
        'Close_Fuel_Temp',
        'Open_Tank_Probe_Status_ID',
        'Close_Tank_Probe_Status_ID',
        'Tank_Readings_DT',
        'Open_Tank_Delivery_State_ID',
        'Close_Tank_Delivery_State_ID',
        'Open_Pump_Delivery_State',
        'Close_Pump_Delivery_State',
        'Open_Dip_Type_ID',
        'Close_Dip_Type_ID',
        'Tank_Variance_Reason_ID',
        'Open_Gauge_TC_Volume_Flag',
        'Close_Gauge_TC_Volume_Flag',
    ];

    public function getTankHistData($periodID)
    {
        $result = TankHistory::select([
            'Tank_History.Tank_ID as tankID',
            'Tanks.Tank_Name as tankName',
            'Open_Gauge_Volume as openVol',
            'Close_Gauge_Volume as closeVol',
            'Hose_Del_Volume as hoseDelVol',
            'Tank_Del_Volume as tankDelVol'
        ])
            ->join('Tanks', 'Tanks.Tank_ID', '=', 'Tank_History.Tank_ID')
            ->where('Period_ID', $periodID)
            ->get();

        return $result;
    }
}
