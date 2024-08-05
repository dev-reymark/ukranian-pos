<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Cashier extends Authenticatable
{
    use Notifiable;

    protected $table = 'Cashiers';
    protected $primaryKey = 'Cashier_ID';

    protected $fillable = [
        'Cashier_Number',
        'Cashier_Name',
        'Cashier_Psw',
        'Cashier_Role_ID',
        'Cashier_Active',
    ];

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'Cashier_ID', 'Cashier_ID');
    }
}

