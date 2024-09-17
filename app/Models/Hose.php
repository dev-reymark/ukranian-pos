<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hose extends Model
{
    use HasFactory;

    protected $table = 'Hoses';

    protected $primaryKey = 'Hose_ID';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'Hose_ID',
        'Pump_ID',
        'Grade_ID',
        'Tank_ID',
        'Volume_Total',
        'Tank2_ID',
        'Hose_number',
        'Mechanical_Total',
        'Money_Total',
        'Theoretical_Total',
        'Volume_Total2',
        'Money_Total2',
        'Theoretical_Total2',
        'Blend_Type',
        'Volume_Total_Turnover_Correction',
        'Money_Total_Turnover_Correction',
        'Volume_Total2_Turnover_Correction',
        'Volume_Total_State_ID',
        'Money_Total_State_ID',
        'Volume_Total2_State_ID',
        'Deleted',
        'Volume_Total1',
        'Money_Total1',
        'Is_Enabled',
    ];

    /**
     * Define the relationship between Hose and Grade.
     */
    public function grade()
    {
        return $this->belongsTo(Grade::class, 'Grade_ID', 'Grade_ID');
    }
}
