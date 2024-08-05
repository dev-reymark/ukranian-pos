<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('Cashier_Number', 'Cashier_Psw');
        Log::info('Login attempt', $credentials);
        $cashier = \App\Models\Cashier::where('Cashier_Number', $credentials['Cashier_Number'])->first();
        Log::info('Cashier from DB:', [$cashier]);
        if ($cashier && trim($cashier->Cashier_Psw) === trim($credentials['Cashier_Psw'])) {
            Auth::guard('cashier')->login($cashier);
            return response()->json(['message' => 'Logged in successfully']);
        }

        return response()->json(['error' => 'Invalid credentials'], 401);
    }


    public function logout(Request $request)
    {
        Auth::guard('cashier')->logout();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
