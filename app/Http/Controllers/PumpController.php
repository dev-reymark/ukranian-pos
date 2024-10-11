<?php

namespace App\Http\Controllers;

use App\Jobs\SetFuelGradesConfigurationJob;
use App\Models\Grade;
use App\Models\Hose;
use App\Models\HoseDelivery;
use App\Models\PriceProfile;
use App\Models\PumpDelivery;
use App\Models\Tank;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PumpController extends Controller
{
    private function getApiUrl()
    {
        return config('services.pts_api.url');
    }
    public function initializePump(
        Grade $grade,
        Hose $hose,
        HoseDelivery $hoseDelivery,
        PriceProfile $priceProfile,
        Tank $tank
    ) {

        // Step 2: Initialize Fuel Grades Configuration (populates Grades and Price Profiles in the database)
        $fuelGrades = $this->getFuelGradesConfiguration();
        if (empty($fuelGrades)) {
            return response()->json(['error' => 'Failed to fetch or initialize Fuel Grades configuration'], 400);
        }
        // Step 1: Initialize Tanks Configuration (populates Tanks in the database)
        $tanks = $this->getTanksConfiguration();
        if (empty($tanks)) {
            return response()->json(['error' => 'Failed to fetch or initialize Tanks configuration'], 400);
        }

        // Step 3: Initialize Pump Nozzles Configuration (populates Pumps and Hoses in the database)
        $pumpNozzles = $this->getPumpNozzlesConfiguration(new Request()); // Assuming a request is available
        if ($pumpNozzles->status() !== 200) {
            return response()->json(['error' => 'Failed to initialize Pump Nozzles configuration'], 400);
        }

        // Step 4: Get the Tank corresponding to the Grade from the Tanks table
        $tank = DB::table('Tanks')->where('Grade_ID', $grade->Grade_ID)->first();
        if (!$tank) {
            return response()->json(['error' => 'Invalid Tank for the given Grade'], 400);
        }

        // Step 5: Get the Hose corresponding to the Tank from the Hoses table
        $hose = DB::table('Hoses')->where('Tank_ID', $tank->Tank_ID)->first();
        if (!$hose) {
            return response()->json(['error' => 'Invalid Hose for the given Tank'], 400);
        }

        // Step 6: Get the Hose Delivery corresponding to the Hose_ID from the Hose_Delivery table
        $hoseDelivery = DB::table('Hose_Delivery')
            ->where('Hose_ID', $hose->Hose_ID)
            ->first();

        if (!$hoseDelivery) {
            return response()->json(['error' => 'Invalid Hose Delivery for the given Hose'], 400);
        }

        // Step 7: Get the Pump corresponding to the Hose from the Pumps table
        $pump = DB::table('Pumps')->where('Pump_ID', $hose->Pump_ID)->first();
        if (!$pump) {
            return response()->json(['error' => 'Invalid Pump for the given Hose'], 400);
        }

        // Step 8: Prepare the data for the pump initialization
        $data = [
            'Grade' => $grade->Grade_ID,
            'Hose' => $hose->Hose_ID,
            'HoseDelivery' => $hoseDelivery->Delivery_ID,
            'Pump' => $pump->Pump_ID,
            'Tank' => $tank->Tank_ID,
            'PriceProfile' => $priceProfile->Price_Profile_ID,
        ];

        return response()->json([
            'message' => 'Pump initialized successfully',
            'data' => $data
        ]);
    }
    public function getPumpStatus(Request $request)
    {
        $pumpCount = 4;
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

            // Fetch the fuel grades, nozzles, and tanks configuration
            $fuelGrades = $this->getFuelGradesConfigurationData();
            $nozzleConfig = $this->getNozzlesConfigurationData();
            // $tanksConfig = $this->getTanksConfiguration();

            // Prepare mappings for fuel grades and prices
            $fuelGradeMap = [];
            $fuelGradePrices = [];
            foreach ($fuelGrades as $grade) {
                $fuelGradeMap[$grade['Id']] = $grade['Name'];
                $fuelGradePrices[$grade['Id']] = $grade['Price'];
            }

            // Process each pump status packet
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

                    // Save to HoseDelivery table
                    $latestDeliveryId = HoseDelivery::max('Delivery_ID'); // Get the maximum Delivery_ID
                    $newDeliveryId = ($latestDeliveryId !== null) ? $latestDeliveryId + 1 : 1; // Start at 1 if there are no entries

                    DB::table('Hose_Delivery')->insert([
                        'Delivery_ID' => $newDeliveryId,
                        'Hose_ID' => $pumpData['Nozzle'],
                        'Pump_ID' => $pumpData['Pump'],
                        'Price_Level' => 1,
                        'Delivery_Volume' => $pumpData['Volume'],
                        'Del_Cost_Price' => $pumpData['Price'],
                        'Delivery_Value' => $pumpData['Amount'],
                        'Transaction_ID' => $pumpData['Transaction'],
                        'Is_Sold' => 0,
                        'FuelGradeName' => $pumpData['FuelGradeName'] ?? null,
                        'FuelGradePrice' => $pumpData['FuelGradePrice'] ?? null,
                    ]);

                    // Calculate the new totals
                    $volumeTotal = DB::table('Hose_Delivery')
                        ->where('Hose_ID', $pumpData['Nozzle'])
                        ->sum('Delivery_Volume');

                    $moneyTotal = DB::table('Hose_Delivery')
                        ->where('Hose_ID', $pumpData['Nozzle'])
                        ->sum('Delivery_Value');

                    // Update the Hoses table
                    DB::table('Hoses')
                        ->where('Hose_ID', $pumpData['Nozzle'])
                        ->update([
                            'Volume_Total' => $volumeTotal,
                            'Money_Total' => $moneyTotal,
                        ]);

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

            // // Merge tanks configuration into the response
            // return response()->json([
            //     'Packets' => $packets,
            //     // 'FuelGrades' => $fuelGrades,
            //     // 'Nozzles' => $nozzleConfig,
            //     // 'Tanks' => $tanksConfig,
            // ]);
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
    public function getTanksConfiguration()
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode('admin:admin')
        ])->post($this->getApiUrl(), [
            'Protocol' => 'jsonPTS',
            'Packets' => [
                [
                    'Id' => 1,
                    'Type' => 'GetTanksConfiguration'
                ]
            ]
        ]);

        if ($response->successful()) {
            $data = $response->json();
            $tanks = $data['Packets'][0]['Data']['Tanks'] ?? [];

            // Insert or update tanks in the database
            foreach ($tanks as $tankData) {
                // Check if the tank already exists
                $existingTank = DB::select('SELECT * FROM Tanks WHERE Tank_ID = ?', [$tankData['Id']]);

                if (!empty($existingTank)) {
                    // Update the existing tank
                    DB::update('UPDATE Tanks SET Grade_ID = ?, Tank_Number = ?, Is_Enabled = ?, Capacity = ?, Gauge_Level = ? WHERE Tank_ID = ?', [
                        $tankData['FuelGradeId'],  // Grade_ID
                        $tankData['Id'],           // Tank_Number
                        1,                         // Is_Enabled (set to 1 for enabled)
                        1000.00,                   // Static Capacity value
                        10.00,                     // Static Gauge_Level value
                        $tankData['Id'],           // Tank_ID for the WHERE clause
                    ]);
                } else {
                    // Insert the new tank
                    DB::insert('INSERT INTO Tanks (Tank_ID, Grade_ID, Tank_Number, Is_Enabled, Capacity, Gauge_Level) VALUES (?, ?, ?, ?, ?, ?)', [
                        $tankData['Id'],            // Custom Tank_ID
                        $tankData['FuelGradeId'],   // Grade_ID
                        $tankData['Id'],            // Tank_Number
                        1,                          // Is_Enabled (set to 1 for enabled)
                        1000.00,                    // Static Capacity value
                        10.00,                      // Static Gauge_Level value
                    ]);
                }
            }

            return $tanks; // Optional: return the tanks data if needed
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

            // Prepare the response data and save hoses
            $responseData = [];

            foreach ($pumpNozzles as $nozzle) {
                $pumpId = $nozzle['PumpId'];

                // Check if pump already exists in the Pumps table
                $existingPump = DB::table('Pumps')->where('Pump_ID', $pumpId)->first();

                if (!$existingPump) {
                    // Get the maximum Logical_Number and increment it to ensure uniqueness
                    $maxLogicalNumber = DB::table('Pumps')->max('Logical_Number');
                    $newLogicalNumber = ($maxLogicalNumber !== null) ? $maxLogicalNumber + 1 : 1; // Start at 1 if no pumps exist

                    // Get the maximum Polling_Address and increment it to ensure uniqueness
                    $maxPollingAddress = DB::table('Pumps')->max('Polling_Address');
                    $newPollingAddress = ($maxPollingAddress !== null) ? $maxPollingAddress + 1 : 1; // Start at 1 if no pumps exist

                    // Insert the pump if it doesn't exist
                    DB::table('Pumps')->insert([
                        'Pump_ID' => $pumpId,
                        'Pump_Type_ID' => 1,
                        'Loop_ID' => 1,
                        'Polling_Address' => $newPollingAddress, // Use the new unique polling address
                        'Logical_Number' => $newLogicalNumber, // Use the new unique logical number
                        'Pump_Name' => 'Pump ' . $pumpId, // Example pump name, modify as needed
                        'Is_Enabled' => 1, // Assuming pump is enabled
                        // Add other necessary fields with default values or null
                    ]);
                }

                // Ensure FuelGradeIds is set and is an array
                if (isset($nozzle['FuelGradeIds']) && is_array($nozzle['FuelGradeIds'])) {
                    foreach ($nozzle['FuelGradeIds'] as $index => $gradeId) {
                        if ($gradeId !== 0) {
                            // Prepare the data for the hose entry
                            $hoseData = [
                                'Pump_ID' => $pumpId,
                                'Grade_ID' => $gradeId,
                                'Tank_ID' => $nozzle['TankIds'][$index] ?? null,
                                'Hose_number' => $index + 1, // Example hose number
                                'Volume_Total' => 0, // Initialize as needed
                                'Mechanical_Total' => 0,
                                'Money_Total' => 0,
                                'Theoretical_Total' => 0,
                                'Volume_Total2' => 0,
                                'Money_Total2' => 0,
                                'Theoretical_Total2' => 0,
                                'Blend_Type' => 0, // Set if necessary
                                'Volume_Total_Turnover_Correction' => 0,
                                'Money_Total_Turnover_Correction' => 0,
                                'Volume_Total2_Turnover_Correction' => 0,
                                'Volume_Total_State_ID' => null,
                                'Money_Total_State_ID' => null,
                                'Volume_Total2_State_ID' => null,
                                'Deleted' => 0, // Set if necessary
                                'Volume_Total1' => 0,
                                'Money_Total1' => 0,
                                'Is_Enabled' => 1, // Assuming the hose is enabled by default
                            ];

                            // Check if the hose already exists
                            $existingHose = DB::table('Hoses')
                                ->where('Pump_ID', $pumpId)
                                ->where('Grade_ID', $gradeId)
                                ->first();

                            if ($existingHose) {
                                // Update the existing hose record
                                DB::table('Hoses')
                                    ->where('Hose_ID', $existingHose->Hose_ID)
                                    ->update($hoseData);
                            } else {
                                // Get the maximum existing Hose_ID and increment by 1
                                $latestHoseId = DB::table('Hoses')->max('Hose_ID');
                                $newHoseId = ($latestHoseId !== null) ? $latestHoseId + 1 : 1; // Start at 1 if there are no entries

                                // Save the nozzle information as a new hose using raw query
                                DB::table('Hoses')->insert(array_merge(['Hose_ID' => $newHoseId], $hoseData));
                            }
                        }
                    }
                }
            }

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
                        'Price_Profile_ID' => $fuelGrade['Id'],
                        'Grade_Description' => trim($fuelGrade['Name']),
                    ];

                    // Save or update the grade in the database
                    Grade::updateOrCreate(
                        ['Grade_ID' => $gradeData['Grade_ID']],
                        $gradeData
                    );

                    // Initialize or update the Price Profile
                    PriceProfile::updateOrCreate(
                        ['Price_Profile_ID' => $fuelGrade['Id']],
                        [
                            'Price_Profile_Name' => $fuelGrade['Name'] . ':' . $fuelGrade['Id'],
                            'Grade_Price' => $fuelGrade['Price'] ?? 0,
                            'Parent_Grade_ID' => $fuelGrade['Id'],
                        ]
                    );
                }
            } else {
                Log::info('No fuel grades found from response.');
            }
        } else {
            Log::error('Failed to fetch fuel grades. Response: ' . $response->body());
        }

        // Return the fetched fuel grades
        return $fuelGrades ?? [];
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
        $pumpDeliveries = HoseDelivery::where('Pump_ID', $pumpId)->get();
        $formattedDeliveries = $pumpDeliveries->map(function ($delivery) {
            return [
                'Delivery_ID' => $delivery->Delivery_ID,
                'Pump' => $delivery->Pump_ID,
                'Nozzle' => $delivery->Hose_ID,
                'Volume' => $delivery->Delivery_Volume,
                'FuelGradeName' => $delivery->FuelGradeName,
                'Price' => $delivery->FuelGradePrice,
                'Amount' => $delivery->Delivery_Value,
                'Is_Sold' => $delivery->Is_Sold,
            ];
        });
        return response()->json($formattedDeliveries);
    }
    // public function getPumpDeliveries($pumpId)
    // {
    //     $pumpDeliveries = PumpDelivery::where('Pump', $pumpId)->get();
    //     return response()->json($pumpDeliveries);
    // }
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
