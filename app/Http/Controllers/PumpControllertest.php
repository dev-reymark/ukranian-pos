<?php

namespace App\Http\Controllers;

use App\Models\PumpDelivery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PumpController extends Controller
{
    private $baseUrl = 'http://172.16.12.200/jsonPTS';
    private $headers;

    public function __construct()
    {
        $this->headers = [
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic ' . base64_encode('admin:admin')
        ];
    }

    public function setUserConfiguration()
    {
        $payload = [
            'Users' => [
                [
                    'Id' => 1,
                    'Login' => 'admin',
                    'Password' => 'admin',
                    'Permissions' => [
                        'Configuration' => true,
                        'Control' => true,
                        'Monitoring' => true,
                        'Reports' => true
                    ]
                ]
            ]
        ];

        return $this->sendRequest([
            'Protocol' => 'jsonPTS',
            'Packets' => [
                [
                    'Id' => 1,
                    'Type' => 'SetUsersConfiguration',
                    'Data' => $payload
                ]
            ]
        ]);
    }

    public function getPumpStatus(Request $request)
    {
        $pumpCount = 10;
        $packets = array_map(function ($i) {
            return [
                'Id' => $i,
                'Type' => 'PumpGetStatus',
                'Data' => ['Pump' => $i]
            ];
        }, range(1, $pumpCount));

        $response = $this->sendRequest([
            'Protocol' => 'jsonPTS',
            'Packets' => $packets
        ]);

        if ($response->successful()) {
            $data = $response->json();
            $packets = $data['Packets'];

            $fuelGrades = $this->getFuelGradesConfigurationData();
            $fuelGradeMap = $this->mapFuelGrades($fuelGrades);
            $fuelGradePrices = $this->mapFuelGradePrices($fuelGrades);

            $nozzleConfig = $this->getNozzlesConfigurationData();

            foreach ($packets as &$packet) {
                if ($packet['Type'] === 'PumpEndOfTransactionStatus') {
                    $this->processPumpData($packet['Data'], $fuelGradeMap, $fuelGradePrices, $nozzleConfig);
                }
                if (isset($packet['Data']['NozzleUp'])) {
                    $this->addFuelGradeInfo($packet['Data'], $nozzleConfig, $fuelGradeMap, $fuelGradePrices);
                }
            }

            return response()->json($packets);
        }

        return $response;
    }

    private function processPumpData(&$pumpData, $fuelGradeMap, $fuelGradePrices, $nozzleConfig)
    {
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

    private function addFuelGradeInfo(&$packetData, $nozzleConfig, $fuelGradeMap, $fuelGradePrices)
    {
        $pumpId = $packetData['Pump'];
        $nozzleUp = $packetData['NozzleUp'];
        $nozzleConfigForPump = $nozzleConfig[$pumpId] ?? null;

        if ($nozzleConfigForPump && isset($nozzleConfigForPump['FuelGradeIds'][$nozzleUp - 1])) {
            $fuelGradeId = $nozzleConfigForPump['FuelGradeIds'][$nozzleUp - 1];
            if ($fuelGradeId) {
                $packetData['FuelGradeName'] = $fuelGradeMap[$fuelGradeId] ?? 'Unknown';
                $packetData['FuelGradePrice'] = $fuelGradePrices[$fuelGradeId] ?? 0;
            }
        }
    }

    private function mapFuelGrades($fuelGrades)
    {
        return array_column($fuelGrades, 'Name', 'Id');
    }

    private function mapFuelGradePrices($fuelGrades)
    {
        return array_column($fuelGrades, 'Price', 'Id');
    }

    private function sendRequest(array $payload)
    {
        $response = Http::withHeaders($this->headers)->post($this->baseUrl, $payload);

        if (!$response->successful()) {
            Log::error('Request failed', ['response' => $response->body()]);
            return response()->json([
                'error' => 'Request failed',
                'message' => $response->body()
            ], $response->status());
        }

        return $response;
    }

    private function getFuelGradesConfigurationData()
    {
        $response = $this->sendRequest([
            'Protocol' => 'jsonPTS',
            'Packets' => [
                [
                    'Id' => 1,
                    'Type' => 'GetFuelGradesConfiguration'
                ]
            ]
        ]);

        return $response->json()['Packets'][0]['Data']['FuelGrades'] ?? [];
    }

    private function getNozzlesConfigurationData()
    {
        $response = $this->sendRequest([
            'Protocol' => 'jsonPTS',
            'Packets' => [
                [
                    'Id' => 1,
                    'Type' => 'GetPumpNozzlesConfiguration'
                ]
            ]
        ]);

        $data = $response->json();
        $pumpNozzles = $data['Packets'][0]['Data']['PumpNozzles'] ?? [];

        $nozzleConfig = [];
        foreach ($pumpNozzles as $nozzle) {
            $nozzleConfig[$nozzle['PumpId']] = $nozzle;
        }

        return $nozzleConfig;
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

        return $this->sendRequest([
            'Protocol' => 'jsonPTS',
            'Packets' => [
                [
                    'Id' => 1,
                    'Type' => 'PumpAuthorize',
                    'Data' => $validated
                ]
            ]
        ]);
    }

    public function stopPump(Request $request)
    {
        $validated = $request->validate([
            'Pump' => 'required|integer|min:1|max:50',
        ]);

        return $this->sendRequest([
            'Protocol' => 'jsonPTS',
            'Packets' => [
                [
                    'Id' => 1,
                    'Type' => 'PumpStop',
                    'Data' => $validated
                ]
            ]
        ]);
    }

    public function stopAllPumps(Request $request)
    {
        $pumpCount = 20; // Number of pumps to stop
        $packets = array_map(function ($i) {
            return [
                'Id' => $i,
                'Type' => 'PumpStop',
                'Data' => ['Pump' => $i]
            ];
        }, range(1, $pumpCount));

        return $this->sendRequest([
            'Protocol' => 'jsonPTS',
            'Packets' => $packets
        ]);
    }

    public function emergencyStopPump(Request $request)
    {
        $validated = $request->validate([
            'Pump' => 'required|integer|min:1|max:50',
        ]);

        return $this->sendRequest([
            'Protocol' => 'jsonPTS',
            'Packets' => [
                [
                    'Id' => 1,
                    'Type' => 'PumpEmergencyStop',
                    'Data' => $validated
                ]
            ]
        ]);
    }

    public function suspendPump(Request $request)
    {
        $validated = $request->validate([
            'Pump' => 'required|integer|min:1|max:50',
        ]);

        return $this->sendRequest([
            'Protocol' => 'jsonPTS',
            'Packets' => [
                [
                    'Id' => 1,
                    'Type' => 'PumpSuspend',
                    'Data' => $validated
                ]
            ]
        ]);
    }

    public function resumePump(Request $request)
    {
        $validated = $request->validate([
            'Pump' => 'required|integer|min:1|max:50',
        ]);

        return $this->sendRequest([
            'Protocol' => 'jsonPTS',
            'Packets' => [
                [
                    'Id' => 1,
                    'Type' => 'PumpResume',
                    'Data' => $validated
                ]
            ]
        ]);
    }

    public function getPumpDeliveries($pumpId)
    {
        $pumpDeliveries = PumpDelivery::where('Pump', $pumpId)->get();
        return response()->json($pumpDeliveries);
    }
}
