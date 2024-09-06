<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Grade;

class GradeController extends Controller
{
    public function getFuelGrades(Request $request)
    {
        // Define the request packet
        $packet = [
            'Id' => 1,
            'Type' => 'GetFuelGradesConfiguration'
        ];

        // Send the HTTP request to the external API
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode('admin:admin')
        ])->post('http://172.16.12.200/jsonPTS', [
            'Protocol' => 'jsonPTS',
            'Packets' => [$packet]
        ]);

        // Check if the request was successful
        if ($response->successful()) {
            $data = $response->json();

            // Assuming 'Packets' is an array and we're interested in the first packet's data
            $fuelGrades = $data['Packets'][0]['Data']['FuelGrades'] ?? [];

            // Iterate through each fuel grade and save or update the record
            foreach ($fuelGrades as $fuelGrade) {
                // Update or create the grade record in the database
                Grade::updateOrCreate(
                    ['Grade_ID' => $fuelGrade['Id']], 
                    [
                        'Grade_Name' => $fuelGrade['Name'],
                        'Grade_Description' => $fuelGrade['Name'],
                    ]
                );
            }

            return response()->json($data);
        } else {
            // Handle error response
            return response()->json([
                'error' => 'Failed to retrieve fuel grades configuration',
                'message' => $response->body()
            ], $response->status());
        }
    }
}
