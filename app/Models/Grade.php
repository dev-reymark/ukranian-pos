<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    use HasFactory;

    protected $table = 'Grades';

    protected $primaryKey = 'Grade_ID';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'Grade_ID',
        'Grade_Name',
        'Price_Profile_ID',
        'Grade_Description',
        'Allocation_Limit',
        'Alloc_Limit_Type',
        'Oil_Company_Code',
        'Tax_Link',
        'Group_Link',
        'Delivery_Timeout',
        'Price_Pole_Segment',
        'Grade_Type',
        'Grade1_ID',
        'Grade2_ID',
        'Blend_Ratio',
        'Grade_Number',
        'Min_Price',
        'Max_Price',
        'Loss_Tolerance',
        'Gain_Tolerance',
        'Deleted',
        'Is_Enabled',
        'Volume_Unit_ID',
    ];

    public function priceProfile()
    {
        return $this->belongsTo(PriceProfile::class, 'Price_Profile_ID', 'Price_Profile_ID');
    }

    public function priceLevels()
    {
        return $this->hasMany(PriceLevel::class, 'Grade_ID', 'Grade_ID');
    }
}

