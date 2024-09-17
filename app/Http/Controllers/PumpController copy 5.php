<?php

namespace App\Http\Controllers;

use App\Models\Grade;
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

    // public function getUserConfiguration()
    // {
    //     // Define the payload for getting user configuration
    //     $payload = [
    //         'Protocol' => 'jsonPTS',
    //         'Packets' => [
    //             [
    //                 'Id' => 1,
    //                 'Type' => 'GetUsersConfiguration'
    //             ]
    //         ]
    //     ];

    //     // Send the HTTP request to get user configuration
    //     $response = Http::withOptions([
    //         'verify' => false,
    //     ])->withHeaders([
    //         'Content-Type' => 'application/json',
    //         'Authorization' => 'Basic ' . base64_encode('admin:admin')
    //     ])->post('http://172.16.12.201/jsonPTS', $payload);

    //     // Check if the request was successful
    //     if ($response->successful()) {
    //         return response()->json($response->json());
    //     } else {
    //         // Handle error response
    //         return response()->json([
    //             'error' => 'Failed to get users configuration',
    //             'message' => $response->body()
    //         ], $response->status());
    //     }
    // }
    // public function setUserConfiguration()
    // {
    //     $payload = [
    //         'Users' => [
    //             [
    //                 'Id' => 1,
    //                 'Login' => 'admin',
    //                 'Password' => 'admin',
    //                 'Permissions' => [
    //                     'Configuration' => true,
    //                     'Control' => true,
    //                     'Monitoring' => true,
    //                     'Reports' => true
    //                 ]
    //             ]
    //         ]
    //     ];

    //     $response = Http::withOptions([
    //         'verify' => false,
    //     ])->withHeaders([
    //         'Content-Type' => 'application/json',
    //         'Authorization' => 'Basic ' . base64_encode('admin:admin')
    //     ])->post('http://172.16.12.201/jsonPTS', [
    //         'Protocol' => 'jsonPTS',
    //         'Packets' => [
    //             [
    //                 'Id' => 1,
    //                 'Type' => 'SetUsersConfiguration',
    //                 'Data' => $payload
    //             ]
    //         ]
    //     ]);

    //     if ($response->successful()) {
    //         return response()->json($response->json());
    //     } else {
    //         return response()->json([
    //             'error' => 'Failed to set users configuration',
    //             'message' => $response->body()
    //         ], $response->status());
    //     }
    // }
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
        ], ['verify' => false]);

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
        ], ['verify' => false]);

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
        ])->post($this->getApiUrl(), [
            'Protocol' => 'jsonPTS',
            'Packets' => [$packet]
        ]);

        // Check if the request was successful
        if ($response->successful()) {
            $data = $response->json();

            // Assuming 'Packets' is an array and we're interested in the first packet's data
            $fuelGrades = $data['Packets'][0]['Data']['FuelGrades'] ?? [];

            // Iterate through each fuel grade and save or update the records
            foreach ($fuelGrades as $fuelGrade) {
                // Update or create the grade record in the database
                $grade = Grade::updateOrCreate(
                    ['Grade_ID' => $fuelGrade['Id']],
                    [
                        'Grade_Name' => $fuelGrade['Name'],
                        'Grade_Description' => $fuelGrade['Name'],
                    ]
                );

                // Check if there's an associated PriceProfile and update or create it
                $priceProfile = PriceProfile::updateOrCreate(
                    ['Price_Profile_ID' => $fuelGrade['Id']], // You may need to adjust this depending on your data
                    [
                        'Price_Profile_Name' => $fuelGrade['Name'],
                        'Grade_Price' => $fuelGrade['Price'],
                        'Parent_Grade_ID' => $grade->Grade_ID, // Set the Grade_ID as Parent_Grade_ID
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

    public function setFuelGradesConfiguration(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'FuelGrades' => 'required|array',
            'FuelGrades.*.Id' => 'required|integer|min:1|max:10',
            'FuelGrades.*.Name' => 'required|string|max:20',
            'FuelGrades.*.Price' => 'required|numeric|min:0',
            'FuelGrades.*.ExpansionCoefficient' => 'nullable|numeric|between:0,0.99999',
        ]);

        // Prepare the payload
        $payload = [
            'Protocol' => 'jsonPTS',
            'Packets' => [
                [
                    'Id' => 1,
                    'Type' => 'SetFuelGradesConfiguration',
                    'Data' => [
                        'FuelGrades' => $validated['FuelGrades']
                    ]
                ]
            ]
        ];

        // Send the HTTP request
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode('admin:admin')
        ])->post($this->getApiUrl(), $payload);

        // Check if the request was successful
        if ($response->successful()) {
            return response()->json($response->json());
        } else {
            return response()->json([
                'error' => 'Failed to set fuel grades configuration',
                'message' => $response->body()
            ], $response->status());
        }
    }

    // app/Http/Controllers/PumpController.php

public function setFuelGrades(Request $request)
{
    // Validate the incoming request data
    $validated = $request->validate([
        'FuelGrades' => 'required|array',
        'FuelGrades.*.Id' => 'required|integer',
        'FuelGrades.*.Name' => 'required|string|max:20',
        'FuelGrades.*.Price' => 'required|numeric',
        'FuelGrades.*.ExpansionCoefficient' => 'nullable|numeric',
    ]);

    $fuelGrades = $validated['FuelGrades'];

    foreach ($fuelGrades as $fuelGrade) {
        // Update or create the grade record
        $grade = Grade::updateOrCreate(
            ['Grade_ID' => $fuelGrade['Id']],
            [
                'Grade_Name' => $fuelGrade['Name'],
                'Grade_Description' => $fuelGrade['Name'],
            ]
        );

        // Update or create the price profile record
        PriceProfile::updateOrCreate(
            ['Price_Profile_ID' => $fuelGrade['Id']],
            [
                'Price_Profile_Name' => $fuelGrade['Name'],
                'Grade_Price' => $fuelGrade['Price'],
                'Expansion_Coefficient' => $fuelGrade['ExpansionCoefficient'] ?? 0,
                'Parent_Grade_ID' => $grade->Grade_ID, // Set the Grade_ID as Parent_Grade_ID
            ]
        );
    }

    // Send a success response
    return response()->json(['message' => 'Fuel grades configuration updated successfully']);
}


    public function authorizePump(Request $request)
    {
        $validated = $request->validate([
            'Pump' => 'required|integer|min:1|max:50',
            'Nozzle' => 'nullable|integer|min:1|max:6',
            'Nozzles' => 'nullable|array',
            'FuelGradeId' => 'nullable|integer|min:1|max:10',
            'FuelGradeIds' => 'nullable|array',
            'Type' => 'required|string|in:Volume,Amount,FullTank',
            'Dose' => 'nullable|numeric',
            'Price' => 'nullable|numeric',
            'Transaction' => 'nullable|integer|min:1|max:65535',
            'AutoCloseTransaction' => 'nullable|boolean',
        ]);

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode('admin:admin')
        ])->post($this->getApiUrl(), [
            'Protocol' => 'jsonPTS',
            'Packets' => [
                [
                    'Id' => 1,
                    'Type' => 'PumpAuthorize',
                    'Data' => $validated
                ]
            ]
        ]);

        if ($response->successful()) {
            $data = $response->json();
            return response()->json($data);
        } else {
            return response()->json([
                'error' => 'Failed to authorize pump',
                'message' => $response->body()
            ], $response->status());
        }
    }

    public function authorizeAllPumps(Request $request)
    {
        $pumpCount = 20; // Number of pumps to authorize
        $packets = [];

        $validated = $request->validate([
            'Nozzle' => 'nullable|integer|min:1|max:6',
            'Nozzles' => 'nullable|array',
            'FuelGradeId' => 'nullable|integer|min:1|max:10',
            'FuelGradeIds' => 'nullable|array',
            'Type' => 'required|string|in:Volume,Amount,FullTank',
            'Dose' => 'nullable|numeric',
            'Price' => 'nullable|numeric',
            'Transaction' => 'nullable|integer|min:1|max:65535',
            'AutoCloseTransaction' => 'nullable|boolean',
        ]);

        // Create packets for all pumps
        for ($i = 1; $i <= $pumpCount; $i++) {
            $packet = [
                'Id' => $i,
                'Type' => 'PumpAuthorize',
                'Data' => array_merge(['Pump' => $i], $validated)
            ];
            $packets[] = $packet;
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
            return response()->json($data);
        } else {
            return response()->json([
                'error' => 'Failed to authorize all pumps',
                'message' => $response->body()
            ], $response->status());
        }
    }

    public function stopPump(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'Pump' => 'required|integer|min:1|max:50',
        ]);

        // Create the packet for stopping the pump
        $packet = [
            'Id' => 1,
            'Type' => 'PumpStop',
            'Data' => $validated
        ];

        // Send the HTTP request
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode('admin:admin')
        ])->post($this->getApiUrl(), [
            'Protocol' => 'jsonPTS',
            'Packets' => [$packet]
        ]);

        // Check if the request was successful
        if ($response->successful()) {
            $data = $response->json();
            return response()->json($data);
        } else {
            // Handle error response
            return response()->json([
                'error' => 'Failed to stop pump',
                'message' => $response->body()
            ], $response->status());
        }
    }

    public function stopAllPumps(Request $request)
    {
        $pumpCount = 20; // Number of pumps to stop
        $packets = [];

        for ($i = 1; $i <= $pumpCount; $i++) {
            $packet = [
                'Id' => $i,
                'Type' => 'PumpStop',
                'Data' => ['Pump' => $i]
            ];
            $packets[] = $packet;
        }

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode('admin:admin')
        ])->post($this->getApiUrl(), [
            'Protocol' => 'jsonPTS',
            'Packets' => $packets
        ]);

        if ($response->successful()) {
            $data = $response->json();
            return response()->json($data);
        } else {
            return response()->json([
                'error' => 'Failed to stop all pumps',
                'message' => $response->body()
            ], $response->status());
        }
    }


    public function emergencyStopPump(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'Pump' => 'required|integer|min:1|max:50',
        ]);

        // Create the packet for the emergency stop
        $packet = [
            'Id' => 1,
            'Type' => 'PumpEmergencyStop',
            'Data' => $validated
        ];

        // Send the HTTP request
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode('admin:admin')
        ])->post($this->getApiUrl(), [
            'Protocol' => 'jsonPTS',
            'Packets' => [$packet]
        ]);

        // Check if the request was successful
        if ($response->successful()) {
            $data = $response->json();
            return response()->json($data);
        } else {
            // Handle error response
            return response()->json([
                'error' => 'Failed to perform emergency stop',
                'message' => $response->body()
            ], $response->status());
        }
    }
    public function suspendPump(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'Pump' => 'required|integer|min:1|max:50',
        ]);

        // Create the packet for suspending the pump
        $packet = [
            'Id' => 1,
            'Type' => 'PumpSuspend',
            'Data' => $validated
        ];

        // Send the HTTP request
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode('admin:admin')
        ])->post($this->getApiUrl(), [
            'Protocol' => 'jsonPTS',
            'Packets' => [$packet]
        ]);

        // Check if the request was successful
        if ($response->successful()) {
            $data = $response->json();
            return response()->json($data);
        } else {
            // Handle error response
            return response()->json([
                'error' => 'Failed to suspend pump',
                'message' => $response->body()
            ], $response->status());
        }
    }
    public function resumePump(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'Pump' => 'required|integer|min:1|max:50',
        ]);

        // Create the packet for resuming the pump
        $packet = [
            'Id' => 1,
            'Type' => 'PumpResume',
            'Data' => $validated
        ];

        // Send the HTTP request
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode('admin:admin')
        ])->post($this->getApiUrl(), [
            'Protocol' => 'jsonPTS',
            'Packets' => [$packet]
        ]);

        // Check if the request was successful
        if ($response->successful()) {
            $data = $response->json();
            return response()->json($data);
        } else {
            // Handle error response
            return response()->json([
                'error' => 'Failed to resume pump',
                'message' => $response->body()
            ], $response->status());
        }
    }


    public function getPumpDeliveries($pumpId)
    {
        $pumpDeliveries = PumpDelivery::where('Pump', $pumpId)->get();
        return response()->json($pumpDeliveries);
    }

    public function restartPTSController(Request $request)
    {
        // Send the HTTP request to restart the PTS controller
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode('admin:admin')
        ])->post($this->getApiUrl(), [
            'Protocol' => 'jsonPTS',
            'Packets' => [
                [
                    'Id' => 1,
                    'Type' => 'Restart'
                ]
            ]
        ]);

        // Check if the request was successful
        if ($response->successful()) {
            $data = $response->json();
            return response()->json([
                'message' => 'PTS controller restarted successfully',
                'data' => $data
            ]);
        } else {
            // Handle error response
            return response()->json([
                'error' => 'Failed to restart PTS controller',
                'message' => $response->body()
            ], $response->status());
        }
    }
}
