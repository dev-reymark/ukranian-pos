<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pump extends Model
{
    // Specify the table name if it's not the plural of the model name
    protected $table = 'Pumps';

    // Specify the primary key if it's different from 'id'
    protected $primaryKey = 'Pump_ID';

    // If the primary key is not auto-incrementing, set $incrementing to false
    public $incrementing = false;

    // Specify the key type if it's not an integer
    protected $keyType = 'int';

    // Disable timestamps if they are not used
    public $timestamps = false;

    // Define the fillable attributes
    protected $fillable = [
        'Pump_Type_ID',
        'Attendant_ID',
        'Loop_ID',
        'Pump_Name',
        'Pump_Description',
        'Logical_Number',
        'Polling_Address',
        'Serial_Number',
        'Pump_History',
        'Price_1_Level',
        'Price_2_Level',
        'Reserved_by',
        'Reserve_State',
        'Price_Multiplier',
        'Value_Multiplier',
        'Deleted',
        'Tag_Reader_Installed',
        'Value_Decimals',
        'Volume_Decimals',
        'Price_Decimals',
        'Is_Enabled',
        'Is_Loaded',
    ];

}
