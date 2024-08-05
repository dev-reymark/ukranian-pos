<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Grade;
use App\Models\PriceProfile;

class GradeController extends Controller
{
    public function getFuelGrades(Request $request)
    {
        $packet = [
            'Id' => 1,
            'Type' => 'GetFuelGradesConfiguration'
        ];

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode('admin:admin')
        ])->post('http://172.16.12.200/jsonPTS', [
            'Protocol' => 'jsonPTS',
            'Packets' => [$packet]
        ]);

        if ($response->successful()) {
            $data = $response->json();
            $fuelGrades = $data['Packets'][0]['Data']['FuelGrades'] ?? [];

            foreach ($fuelGrades as $fuelGrade) {
                $priceProfile = PriceProfile::find($fuelGrade['Price_Profile_ID']);

                $grade = Grade::updateOrCreate(
                    ['Grade_ID' => $fuelGrade['Id']],
                    [
                        'Grade_Name' => $fuelGrade['Name'],
                        'Grade_Description' => $fuelGrade['Description'] ?? $fuelGrade['Name'],
                        'Price_Profile_ID' => $fuelGrade['PriceProfile_ID'],
                    ]
                );

                // Additional logic to associate price levels if available
                if (isset($fuelGrade['PriceLevels'])) {
                    foreach ($fuelGrade['PriceLevels'] as $priceLevelData) {
                        $grade->priceLevels()->updateOrCreate(
                            ['Price_Level' => $priceLevelData['Level']],
                            [
                                'Price_Profile_ID' => $priceProfile->Price_Profile_ID,
                                'Grade_Price' => $priceLevelData['Price'],
                                'Price_Index' => $priceLevelData['Index'],
                                'Price_Ratio' => $priceLevelData['Ratio'],
                            ]
                        );
                    }
                }
            }

            return response()->json($data);
        } else {
            return response()->json([
                'error' => 'Failed to retrieve fuel grades configuration',
                'message' => $response->body()
            ], $response->status());
        }
    }
}
