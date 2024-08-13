<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Finalisation;

class FinalisationController extends Controller
{
    public function getMOP()
    {
        // Fetch all MOP records from the Finalisation model
        $mops = Finalisation::all();

        // Return the records with 'MOP_Ref' included
        return response()->json([
            'data' => $mops
        ]);
    }
}
