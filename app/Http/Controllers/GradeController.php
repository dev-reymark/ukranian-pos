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
        $grades = Grade::with(['priceProfile', 'priceLevels'])->get();

        // Return the grades as a JSON response
        return response()->json($grades);
    }
}
