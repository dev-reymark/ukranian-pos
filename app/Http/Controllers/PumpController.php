<?php

namespace App\Http\Controllers;

use App\Models\PumpDelivery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PumpController extends Controller
{
    public function getPumpStatus(Request $request)
    {
        $pumpCount = 20;
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
        ])->post('http://172.16.12.200/jsonPTS', [
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


    private function getFuelGradesConfigurationData()
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode('admin:admin')
        ])->post('http://172.16.12.200/jsonPTS', [
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
        ])->post('http://172.16.12.200/jsonPTS', [
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
        ])->post('http://172.16.12.200/jsonPTS', [
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
        ])->post('http://172.16.12.200/jsonPTS', [
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
        ])->post('http://172.16.12.200/jsonPTS', [
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
        ])->post('http://172.16.12.200/jsonPTS', [
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
        ])->post('http://172.16.12.200/jsonPTS', [
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
        ])->post('http://172.16.12.200/jsonPTS', [
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
}
