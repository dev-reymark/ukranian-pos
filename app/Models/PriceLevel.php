<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PriceLevel extends Model
{
    protected $table = 'Price_Levels';

    public $timestamps = false;

    protected $fillable = [
        'Price_Level',
        'Price_Profile_ID',
        'Grade_Price',
        'Price_Index',
        'Price_Ratio',
    ];
    
    public function grade()
    {
        return $this->belongsTo(Grade::class, 'Grade_ID', 'Grade_ID');
    }
}

