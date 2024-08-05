<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemType extends Model
{
    protected $table = 'Item_Types';

    public $timestamps = false;

    protected $fillable = [
        'Item_Type',
        'Item_Type_Descr',
    ];
}
