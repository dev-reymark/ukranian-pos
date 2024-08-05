<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    use HasFactory;

    protected $table = 'Receipt';

    protected $primaryKey = 'Receipt_ID';

    protected $fillable = [
        'Receipt_Name',
        'Receipt_Header_L1',
        'Receipt_Header_L2',
        'Receipt_Header_L3',
        'Receipt_Header_L4',
        'Receipt_Header_L5',
        'Receipt_Footer_L1',
        'Receipt_Footer_L2',
        'Receipt_Footer_L3',
        'Receipt_Footer_L4',
        'Receipt_Footer_L5',
    ];
    
    public $incrementing = false;
}
