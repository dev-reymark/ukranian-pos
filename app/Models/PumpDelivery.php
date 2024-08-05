<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PumpDelivery extends Model
{
    use HasFactory;

    protected $table = 'Pump_Delivery';

    protected $primaryKey = 'Delivery_ID';

    public $incrementing = true;
    
    protected $fillable = [
        'Pump',
        'Nozzle',
        'Volume',
        'TCVolume',
        'Price',
        'Amount',
        'Transaction',
        'User',
        'Is_Sold',
        'FuelGradeName',
        'FuelGradePrice',
    ];

    protected $casts = [
        'Volume' => 'float',
        'Price' => 'float',
        'Amount' => 'float',
    ];
}

