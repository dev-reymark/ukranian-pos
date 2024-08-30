<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use Illuminate\Http\Request;

class DiscountController extends Controller
{
    public function getDiscount()
    {
        // $discounts = Discount::all();
        // Fetch all discounts with their related presets
        $discounts = Discount::with('presets')->get();


        return response()->json($discounts);
    }
}
