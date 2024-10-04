<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PriceProfile extends Model
{
    protected $table = 'Price_Profile';
    protected $primaryKey = 'Price_Profile_ID';
    
    public $timestamps = false;

    protected $fillable = [
        'Price_Profile_ID',
        'Price_Profile_Name',
        'Scheduled_ST',
        'Parent_Grade_ID',
        'Deleted',
        'Grade_Price',
    ];

    public function grades()
    {
        return $this->hasMany(Grade::class, 'Price_Profile_ID', 'Price_Profile_ID');
    }
}

