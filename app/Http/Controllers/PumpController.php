<?php

namespace App\Http\Controllers;

use App\Jobs\SetFuelGradesConfigurationJob;
use App\Models\Grade;
use App\Models\Hose;
use App\Models\PriceProfile;
use App\Models\PumpDelivery;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
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
        ]);

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


    public function getFuelGradesConfiguration()
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
            $fuelGrades = $data['Packets'][0]['Data']['FuelGrades'] ?? [];

            if (!empty($fuelGrades)) {
                foreach ($fuelGrades as $fuelGrade) {
                    $gradeData = [
                        'Grade_ID' => $fuelGrade['Id'],
                        'Grade_Name' => trim($fuelGrade['Name']),
                        // 'Price_Profile_ID' => $fuelGrade['Id'],
                        'Grade_Description' => trim($fuelGrade['Name']),
                    ];

                    // Save or update the grade in the database
                    Grade::updateOrCreate(
                        ['Grade_ID' => $gradeData['Grade_ID']],
                        $gradeData
                    );
                }
            } else {
                Log::info('No fuel grades found from response.');
            }
        } else {
            Log::error('Failed to fetch fuel grades. Response: ' . $response->body());
        }

        if ($response->successful()) {
            $data = $response->json();
            return $data['Packets'][0]['Data']['FuelGrades'] ?? [];
        }

        return [];
    }

    public function setFuelGradesConfiguration(Request $request)
    {
        Log::info('SetFuelGrades payload:', $request->all());

        // Extract the effectivity date from the request
        $effectivityDate = $request->input('EffectivityDate');
        $fuelGrades = $request->input('Packets')[0]['Data']['FuelGrades'];

        Log::info('Effectivity Date:', ['effectivityDate' => $effectivityDate]);

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

        try {
            // Clean and parse the effectivity date
            $cleanedDate = preg_replace('/\[.*\]/', '', $effectivityDate);
            $parsedDate = new \DateTime($cleanedDate);
            $formattedDate = $parsedDate->format('Y-m-d H:i:s');

            // Loop through each fuel grade in the request data
            foreach ($fuelGrades as $grade) {
                if ($grade['isSelected']) {
                    // Get the next Price_Profile_ID
                    $lastProfile = PriceProfile::max('Price_Profile_ID');
                    $nextProfileId = $lastProfile ? $lastProfile + 1 : 1;

                    // Create a new PriceProfile
                    $priceProfile = PriceProfile::create([
                        'Price_Profile_ID' => $nextProfileId,
                        'Scheduled_ST' => $formattedDate,
                        'Price_Profile_Name' => $grade['Name'] . ':' . $nextProfileId,
                        'Grade_Price' => $grade['Price'],
                        'Parent_Grade_ID' => $grade['Id'],
                    ]);

                    // Fetch the ID from the database
                    $retrievedProfile = PriceProfile::find($nextProfileId);

                    Log::info('New Price Profile created:', [
                        'Price_Profile_ID' => $retrievedProfile ? $retrievedProfile->Price_Profile_ID : 'Not Found',
                        'Grade_ID' => $grade['Id'],
                    ]);

                    // Update the Grade table with the new Price_Profile_ID
                    $updateResult = Grade::where('Grade_Name', $grade['Name'])->update([
                        'Price_Profile_ID' => $nextProfileId, // Use nextProfileId directly
                    ]);

                    Log::info('Update result for Grade:', [
                        'Grade_ID' => $grade['Id'],
                        'Rows_Affected' => $updateResult,
                    ]);
                }
                
            }

            Log::info('Successfully stored all selected price profiles and updated grades.');

            // Check if the scheduled time is in the future
            if (Carbon::now()->lt(Carbon::parse($formattedDate))) {
                Log::info('Prices scheduled for future application.', ['scheduled_time' => $formattedDate]);
                return response()->json([
                    'message' => 'Fuel grades configuration will be updated on the scheduled time.',
                    'scheduled_time' => $formattedDate,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error occurred while setting fuel grades:', ['error' => $e->getMessage()]);
            return response()->json([
                'error' => 'An error occurred while processing fuel grades',
                'message' => $e->getMessage(),
            ], 400);
        }

        // Prepare the payload for the HTTP request
        $payload = [
            'Protocol' => 'jsonPTS',
            'Packets' => $request->input('Packets')
        ];

        try {
            Log::info('Sending HTTP request with payload:', $payload); // Log the payload

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
                Log::error('Failed to update fuel grades configuration', [
                    'response' => $response->body(),
                    'status_code' => $response->status() // Log the status code
                ]);

                return response()->json([
                    'error' => 'Failed to update fuel grades configuration',
                    'message' => $response->body()
                ], $response->status());
            }
        } catch (\Exception $e) {
            Log::error('Exception occurred while updating fuel grades configuration', [
                'exception' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'An unexpected error occurred',
                'message' => $e->getMessage()
            ], 500);
        }
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
        $pumpCount = 32;
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
        $pumpCount = 32;
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
