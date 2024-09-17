<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Hose;
use App\Models\PriceProfile;
use App\Models\PumpDelivery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PumpController extends Controller
{
    private function getApiUrl()
    {
        return config('services.pts_api.url');
    }
    public function getPumpStatus(Request $request)
    {
        $pumpCount = 10;
        $packets = [];

        // Create packets for all pumps
        for ($i = 1; $i <= $pumpCount; $i++) {
            $packets[] = [
                'Id' => $i,
                'Type' => 'PumpGetStatus',
                'Data' => [
                    'Pump' => $i
                ]
            ];
        }

        // Send the HTTP request
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode('admin:admin')
        ])->post($this->getApiUrl(), [
            'Protocol' => 'jsonPTS',
            'Packets' => $packets
        ]);

        if ($response->successful()) {
            $data = $response->json();
            $packets = $data['Packets'];

            // Fetch the fuel grades configuration
            $fuelGrades = $this->getFuelGradesConfigurationData();
            $fuelGradeMap = [];
            $fuelGradePrices = [];

            foreach ($fuelGrades as $grade) {
                $fuelGradeMap[$grade['Id']] = $grade['Name'];
                $fuelGradePrices[$grade['Id']] = $grade['Price'];
            }

            // Fetch the nozzles configuration
            $nozzleConfig = $this->getNozzlesConfigurationData();

            foreach ($packets as &$packet) {
                if ($packet['Type'] === 'PumpEndOfTransactionStatus') {
                    $pumpData = $packet['Data'];
                    Log::info('Pump Data:', $pumpData);

                    // Add FuelGradeName and FuelGradePrice
                    $nozzleUp = $pumpData['Nozzle'];
                    $nozzleConfigForPump = $nozzleConfig[$pumpData['Pump']] ?? null;

                    if ($nozzleConfigForPump && isset($nozzleConfigForPump['FuelGradeIds'][$nozzleUp - 1])) {
                        $fuelGradeId = $nozzleConfigForPump['FuelGradeIds'][$nozzleUp - 1];
                        if ($fuelGradeId) {
                            $pumpData['FuelGradeName'] = $fuelGradeMap[$fuelGradeId] ?? 'Unknown';
                            $pumpData['FuelGradePrice'] = $fuelGradePrices[$fuelGradeId] ?? 0;
                        }
                    }

                    // Save pumpData to the database
                    Log::info('Saving Pump Data:', $pumpData);

                    // Save pumpData to the database
                    PumpDelivery::create([
                        'Pump' => $pumpData['Pump'],
                        'Nozzle' => $pumpData['Nozzle'],
                        'Volume' => $pumpData['Volume'],
                        'Price' => $pumpData['Price'],
                        'Amount' => $pumpData['Amount'],
                        'Transaction' => $pumpData['Transaction'],
                        'User' => $pumpData['User'],
                        'Is_Sold' => 0,
                        'FuelGradeName' => $pumpData['FuelGradeName'] ?? null,
                        'FuelGradePrice' => $pumpData['FuelGradePrice'] ?? null,
                    ]);

                    // Close the transaction
                    $this->closeTransaction($pumpData['Pump'], $pumpData['Transaction']);
                }
                if (isset($packet['Data']['NozzleUp'])) {
                    $pumpId = $packet['Data']['Pump'];
                    $nozzleUp = $packet['Data']['NozzleUp'];
                    $nozzleConfigForPump = $nozzleConfig[$pumpId] ?? null;

                    if ($nozzleConfigForPump && isset($nozzleConfigForPump['FuelGradeIds'][$nozzleUp - 1])) {
                        $fuelGradeId = $nozzleConfigForPump['FuelGradeIds'][$nozzleUp - 1];
                        if ($fuelGradeId) {
                            $packet['Data']['FuelGradeName'] = $fuelGradeMap[$fuelGradeId] ?? 'Unknown';
                            $packet['Data']['FuelGradePrice'] = $fuelGradePrices[$fuelGradeId] ?? 0;
                        }
                    }
                }
            }

            return response()->json($packets);
        } else {
            return response()->json([
                'error' => 'Failed to fetch pump status',
                'message' => $response->body()
            ], $response->status());
        }
    }

    private function closeTransaction($pumpId, $transactionNumber)
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode('admin:admin')
        ])->post($this->getApiUrl(), [
            'Protocol' => 'jsonPTS',
            'Packets' => [
                [
                    'Id' => 1,
                    'Type' => 'PumpCloseTransaction',
                    'Data' => [
                        'Pump' => $pumpId,
                        'Transaction' => $transactionNumber
                    ]
                ]
            ]
        ], ['verify' => false]);

        if (!$response->successful()) {
            Log::error('Failed to close transaction for pump ' . $pumpId . ' and transaction ' . $transactionNumber);
        }
    }


    private function getFuelGradesConfigurationData()
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode('admin:admin')
        ])->post($this->getApiUrl(), [
            'Protocol' => 'jsonPTS',
            'Packets' => [
                [
                    'Id' => 1,
                    'Type' => 'GetFuelGradesConfiguration'
                ]
            ]
        ]);

        if ($response->successful()) {
            $data = $response->json();
            return $data['Packets'][0]['Data']['FuelGrades'] ?? [];
        }

        return [];
    }


    private function getNozzlesConfigurationData()
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode('admin:admin')
        ])->post($this->getApiUrl(), [
            'Protocol' => 'jsonPTS',
            'Packets' => [
                [
                    'Id' => 1,
                    'Type' => 'GetPumpNozzlesConfiguration'
                ]
            ]
        ]);

        if ($response->successful()) {
            $data = $response->json();
            $pumpNozzles = $data['Packets'][0]['Data']['PumpNozzles'] ?? [];

            $nozzleConfig = [];
            foreach ($pumpNozzles as $nozzle) {
                $nozzleConfig[$nozzle['PumpId']] = $nozzle;
            }

            return $nozzleConfig;
        }

        return [];
    }

    public function getPumpNozzlesConfiguration(Request $request)
    {
        $packet = [
            'Id' => 1,
            'Type' => 'GetPumpNozzlesConfiguration'
        ];

        // Fetch the pump nozzles configuration
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode('admin:admin')
        ])->post($this->getApiUrl(), [
            'Protocol' => 'jsonPTS',
            'Packets' => [$packet]
        ]);

        if ($response->successful()) {
            $data = $response->json();
            $pumpNozzles = $data['Packets'][0]['Data']['PumpNozzles'] ?? [];

            // Fetch the fuel grades
            $fuelGrades = $this->getFuelGradesConfigurationData();
            $fuelGradesMap = [];

            foreach ($fuelGrades as $fuelGrade) {
                $fuelGradesMap[$fuelGrade['Id']] = [
                    'Name' => $fuelGrade['Name'],
                    'Price' => $fuelGrade['Price'],
                ];
            }

            // Prepare the response data
            $responseData = [];

            foreach ($pumpNozzles as $nozzle) {
                $pumpId = $nozzle['PumpId'];
                $nozzles = [];

                foreach ($nozzle['FuelGradeIds'] as $index => $gradeId) {
                    if ($gradeId !== 0) {
                        // Fetch or create the grade record
                        $grade = Grade::updateOrCreate(
                            ['Grade_ID' => $gradeId],
                            [
                                'Grade_Name' => $fuelGradesMap[$gradeId]['Name'] ?? 'Unknown',
                                'Grade_Description' => $fuelGradesMap[$gradeId]['Name'] ?? 'No description',
                            ]
                        );

                        // Save or update the hose record
                        Hose::updateOrCreate(
                            [
                                'Hose_ID' => $index + 1,
                                'Pump_ID' => $pumpId,
                                'Grade_ID' => $gradeId,
                                'Tank_ID' => $nozzle['TankIds'][$index] ?? null
                            ],
                            [
                                'Hose_number' => $index + 1,
                                'Is_Enabled' => true,
                            ]
                        );

                        // Ensure the price profile is updated
                        PriceProfile::updateOrCreate(
                            ['Price_Profile_ID' => $gradeId],
                            [
                                'Price_Profile_Name' => $fuelGradesMap[$gradeId]['Name'] ?? 'Unknown',
                                'Grade_Price' => $fuelGradesMap[$gradeId]['Price'] ?? 0,
                                'Parent_Grade_ID' => $gradeId,
                            ]
                        );

                        // Add the nozzle information
                        $nozzles[] = [
                            'Hose_ID' => $index + 1,
                            'Grade_ID' => $gradeId,
                            'FuelGradeName' => $fuelGradesMap[$gradeId]['Name'] ?? 'Unknown',
                            'FuelGradePrice' => $fuelGradesMap[$gradeId]['Price'] ?? 0,
                            'Tank_ID' => $nozzle['TankIds'][$index] ?? null
                        ];
                    }
                }

                $responseData[] = [
                    'PumpId' => $pumpId,
                    'Nozzles' => $nozzles
                ];
            }

            // Return the structured response
            return response()->json([
                'Pumps' => $responseData,
                'FuelGrades' => $fuelGrades,
            ]);
        } else {
            return response()->json([
                'error' => 'Failed to fetch pump nozzles configuration',
                'message' => $response->body()
            ], $response->status());
        }
    }

    public function setPumpNozzlesConfiguration(Request $request)
    {
        Log::info('SetPumpNozzlesConfiguration payload:', $request->all());

        // Validate incoming request data
        $validated = $request->validate([
            'Protocol' => 'required|string',
            'Packets' => 'required|array',
            'Packets.*.Id' => 'required|integer',
            'Packets.*.Type' => 'required|string',
            'Packets.*.Data' => 'required|array',
            'Packets.*.Data.PumpNozzles' => 'required|array',
            'Packets.*.Data.PumpNozzles.*.PumpId' => 'required|integer',
            'Packets.*.Data.PumpNozzles.*.FuelGradeIds' => 'required|array',
            'Packets.*.Data.PumpNozzles.*.TankIds' => 'nullable|array',
        ]);

        $payload = [
            'Protocol' => 'jsonPTS',
            'Packets' => [
                [
                    'Id' => 1,
                    'Type' => 'SetFuelGradesConfiguration',
                    'Data' => $request->input('FuelGrades')
                ]
            ]
        ];

        try {
            // Send the HTTP request to set fuel grades configuration
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => 'Basic ' . base64_encode('admin:admin')
            ])->post($this->getApiUrl(), $payload);

            // Check if the request was successful
            if ($response->successful()) {
                $data = $response->json();
                return response()->json([
                    'message' => 'Fuel grades configuration updated successfully',
                    'data' => $data
                ]);
            } else {
                // Log the error response
                Log::error('Failed to update fuel grades configuration', [
                    'response' => $response->body()
                ]);

                return response()->json([
                    'error' => 'Failed to update fuel grades configuration',
                    'message' => $response->body()
                ], $response->status());
            }
        } catch (\Exception $e) {
            // Log the exception
            Log::error('Exception occurred while updating fuel grades configuration', [
                'exception' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'An unexpected error occurred',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function setPumpPrices(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'Protocol' => 'required|string',
            'Packets' => 'required|array',
            'Packets.*.Id' => 'required|integer',
            'Packets.*.Type' => 'required|string|in:PumpSetPrices',
            'Packets.*.Data.Pump' => 'required|integer|between:1,50',
            'Packets.*.Data.Prices' => 'required|array',
            'Packets.*.Data.Prices.*' => 'required|numeric|min:0|max:999.999',
        ]);

        $data = $request->input('Packets');

        // Create payload for SetPumpNozzlesConfiguration
        $nozzlesConfigPayload = [
            'Protocol' => 'jsonPTS',
            'Packets' => [
                [
                    'Id' => 1,
                    'Type' => 'SetPumpNozzlesConfiguration',
                    'Data' => [
                        'PumpNozzles' => $this->getNozzlesConfigurationData()  // Adjust as needed
                    ]
                ]
            ]
        ];

        // Send SetPumpNozzlesConfiguration request
        $nozzlesResponse = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode('admin:admin')
        ])->post($this->getApiUrl(), $nozzlesConfigPayload);

        if (!$nozzlesResponse->successful()) {
            Log::error('Failed to set pump nozzles configuration', [
                'response' => $nozzlesResponse->body()
            ]);
            return response()->json([
                'error' => 'Failed to set pump nozzles configuration',
                'message' => $nozzlesResponse->body()
            ], $nozzlesResponse->status());
        }

        // Now proceed with setting pump prices
        foreach ($data as $packet) {
            $pumpId = $packet['Data']['Pump'];
            $prices = $packet['Data']['Prices'];

            Log::info('Received PumpSetPrices data:', ['PumpId' => $pumpId, 'Prices' => $prices]);

            $payload = [
                'Protocol' => 'jsonPTS',
                'Packets' => [
                    [
                        'Id' => 1,
                        'Type' => 'PumpSetPrices',
                        'Data' => [
                            'Pump' => $pumpId,
                            'Prices' => $prices
                        ]
                    ]
                ]
            ];

            try {
                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Basic ' . base64_encode('admin:admin')
                ])->post($this->getApiUrl(), $payload);

                if ($response->successful()) {
                    return response()->json([
                        'message' => 'Prices updated successfully',
                        'data' => $response->json()
                    ]);
                } else {
                    Log::error('Failed to update pump prices', [
                        'response' => $response->body()
                    ]);

                    return response()->json([
                        'error' => 'Failed to update pump prices',
                        'message' => $response->body()
                    ], $response->status());
                }
            } catch (\Exception $e) {
                Log::error('Exception occurred while updating pump prices', [
                    'exception' => $e->getMessage()
                ]);

                return response()->json([
                    'error' => 'An unexpected error occurred',
                    'message' => $e->getMessage()
                ], 500);
            }
        }

        return response()->json(['error' => 'Invalid packet type'], 422);
    }

    public function setFuelGradesConfiguration(Request $request)
    {
        Log::info('SetFuelGradesConfiguration payload:', $request->all());

        // Validate incoming request data
        $validated = $request->validate([
            'Protocol' => 'required|string',
            'Packets' => 'required|array',
            'Packets.*.Id' => 'required|integer',
            'Packets.*.Type' => 'required|string|in:SetFuelGradesConfiguration',
            'Packets.*.Data.FuelGrades' => 'required|array',
            'Packets.*.Data.FuelGrades.*.Id' => 'required|integer|between:1,10',
            'Packets.*.Data.FuelGrades.*.Name' => 'required|string|max:20',
            'Packets.*.Data.FuelGrades.*.Price' => 'required|numeric|min:0|max:999999999',
            'Packets.*.Data.FuelGrades.*.ExpansionCoefficient' => 'nullable|numeric|min:0|max:999.99999',
        ]);

        $payload = [
            'Protocol' => 'jsonPTS',
            'Packets' => $request->input('Packets')
        ];

        try {
            // Send the HTTP request to set fuel grades configuration
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => 'Basic ' . base64_encode('admin:admin')
            ])->post($this->getApiUrl(), $payload);

            // Check if the request was successful
            if ($response->successful()) {
                $data = $response->json();
                return response()->json([
                    'message' => 'Fuel grades configuration updated successfully',
                    'data' => $data
                ]);
            } else {
                // Log the error response
                Log::error('Failed to update fuel grades configuration', [
                    'response' => $response->body()
                ]);

                return response()->json([
                    'error' => 'Failed to update fuel grades configuration',
                    'message' => $response->body()
                ], $response->status());
            }
        } catch (\Exception $e) {
            // Log the exception
            Log::error('Exception occurred while updating fuel grades configuration', [
                'exception' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'An unexpected error occurred',
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function getPumpDeliveries($pumpId)
    {
        $pumpDeliveries = PumpDelivery::where('Pump', $pumpId)->get();
        return response()->json($pumpDeliveries);
    }
}
