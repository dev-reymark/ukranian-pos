<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    protected $primaryKey = 'discount_id';

    protected $fillable = [
        'discount_name',
        'discount_type',
        'discount_value',
        'discount_keynumber',
        'discount_keylabel',
        'discount_allowoverride',
        'discount_restricted',
        'discount_code_id',
        'discount_input_type',
        'discount_list_position',
        'item_limit_unit_type',
        'item_limit_min_value',
        'item_limit_max_value',
        'department_id',
        'discount_list_visible',
    ];

    public $timestamps = true;

    public function presets()
    {
        return $this->hasMany(DiscountPreset::class, 'discount_id', 'discount_id');
    }
}
