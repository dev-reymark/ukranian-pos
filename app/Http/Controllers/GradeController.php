<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Grade;

class GradeController extends Controller
{
    public function getGrades()
    {
        // Fetch all grades from the database
        // $grades = Grade::all();

        // Fetch all grades with their related PriceProfile and PriceLevels
        $grades = Grade::with(['priceProfile'])->get();

        // Return the grades as a JSON response
        return response()->json($grades);
    }

    public function updatePrice(Request $request, $gradeId)
    {
        $grade = Grade::findOrFail($gradeId);
        $newPrice = $request->input('newPrice');

        // Assuming you have a way to update the price in PriceProfile
        $priceProfile = $grade->priceProfile;
        $priceProfile->Grade_Price = $newPrice;
        $priceProfile->save();

        return response()->json(['message' => 'Price updated successfully']);
    }
}
