<?php

namespace App\Http\Controllers;

use App\Models\Cashier;

class CashierController extends Controller
{
    public function getAllCashier()
    {
        return Cashier::all();
    }
}
