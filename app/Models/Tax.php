<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tax extends Model
{
    protected $table = 'Taxes';
    protected $primaryKey = 'Tax_ID';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'Tax_ID',
        'Tax_Name',
        'Tax_rate',
        'Tax_Inclusive',
        'Tax_Legend',
    ];
}
