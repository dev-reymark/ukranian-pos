<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Finalisation;

class FinalisationController extends Controller
{
    public function getMOP()
    {
        try {
            $mopList = Finalisation::all();

            if ($mopList->isEmpty()) {
                return response()->json([
                    "statusCode" => 0,
                    "statusDescription" => "Failed to retrieve mop list"
                ]);
            }

            return response()->json([
                "statusCode" => 1,
                "statusDescription" => "Success",
                "data" => $mopList
            ]);

        } catch (\Exception $e) {
            return response()->json([
                "statusCode" => 0,
                "statusDescription" => "Failed to retrieve mop list: " . $e->getMessage()
            ]);
        }
    }
}
