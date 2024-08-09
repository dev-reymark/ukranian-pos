<?php

namespace App\Http\Controllers;

use App\Models\Cashier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CashierController extends Controller
{
    public function getAllCashier()
    {
        return Cashier::all();
    }

    public function getLoggedInCashier(Request $request)
    {
        $cashier = Auth::guard('cashier')->user();
        return response()->json([
            'Cashier_Name' => trim($cashier->Cashier_Name),
            'Cashier_ID' => $cashier->Cashier_ID
        ]);
    }
}
