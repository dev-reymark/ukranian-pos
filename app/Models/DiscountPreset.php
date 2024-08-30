<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscountPreset extends Model
{
    use HasFactory;

    protected $primaryKey = 'preset_id';

    protected $fillable = [
        'discount_id',
        'preset_name',
        'preset_value',
        'tax_exempt',
        'volume_min',
        'value_min',
        'start_date',
        'end_date',
        'Item_Type',
        'Item_ID',
    ];

    public $timestamps = true;

    public function discount()
    {
        return $this->belongsTo(Discount::class, 'discount_id', 'discount_id');
    }
}
