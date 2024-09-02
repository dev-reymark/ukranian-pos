<?php

namespace App\Http\Controllers;

use App\Models\PumpDelivery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PumpController extends Controller
{
    private $baseUrl;
    private $authHeader;

    public function __construct()
    {
        $this->baseUrl = 'http://172.16.12.200/jsonPTS';
        $this->authHeader = 'Basic ' . base64_encode('admin:admin');
    }
    private function sendRequest(array $payload)
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => $this->authHeader
        ])->post($this->baseUrl, $payload);

        if ($response->successful()) {
            return response()->json($response->json());
        } else {
            return response()->json([
                'error' => 'Request failed',
                'message' => $response->body()
            ], $response->status());
        }
    }

    private function getPayload(string $type, array $data)
    {
        return [
            'Protocol' => 'jsonPTS',
            'Packets' => [
                [
                    'Id' => 1,
                    'Type' => $type,
                    'Data' => $data
                ]
            ]
        ];
    }

    public function setUserConfiguration()
    {
        $payload = $this->getPayload('SetUsersConfiguration', [
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
        ]);

        return $this->sendRequest($payload);
    }

    public function getPumpStatus(Request $request)
    {
        $pumpCount = 10;
        $packets = [];

        for ($i = 1; $i <= $pumpCount; $i++) {
            $packets[] = [
                'Id' => $i,
                'Type' => 'PumpGetStatus',
                'Data' => [
                    'Pump' => $i
                ]
            ];
        }

        $payload = $this->getPayload('PumpGetStatus', $packets);
        $response = $this->sendRequest($payload);

        if ($response->successful()) {
            $data = $response->json();
            $packets = $data['Packets'];

            $fuelGrades = $this->getFuelGradesConfigurationData();
            $fuelGradeMap = [];
            $fuelGradePrices = [];

            foreach ($fuelGrades as $grade) {
                $fuelGradeMap[$grade['Id']] = $grade['Name'];
                $fuelGradePrices[$grade['Id']] = $grade['Price'];
            }

            $nozzleConfig = $this->getNozzlesConfigurationData();

            foreach ($packets as &$packet) {
                if ($packet['Type'] === 'PumpEndOfTransactionStatus') {
                    $pumpData = $packet['Data'];
                    Log::info('Pump Data:', $pumpData);

                    $nozzleUp = $pumpData['Nozzle'];
                    $nozzleConfigForPump = $nozzleConfig[$pumpData['Pump']] ?? null;

                    if ($nozzleConfigForPump && isset($nozzleConfigForPump['FuelGradeIds'][$nozzleUp - 1])) {
                        $fuelGradeId = $nozzleConfigForPump['FuelGradeIds'][$nozzleUp - 1];
                        if ($fuelGradeId) {
                            $pumpData['FuelGradeName'] = $fuelGradeMap[$fuelGradeId] ?? 'Unknown';
                            $pumpData['FuelGradePrice'] = $fuelGradePrices[$fuelGradeId] ?? 0;
                        }
                    }

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
        }

        return $response;
    }

    private function getFuelGradesConfigurationData()
    {
        $payload = $this->getPayload('GetFuelGradesConfiguration', []);
        $response = $this->sendRequest($payload);

        if ($response->successful()) {
            $data = $response->json();
            return $data['Packets'][0]['Data']['FuelGrades'] ?? [];
        }

        return [];
    }

    private function getNozzlesConfigurationData()
    {
        $payload = $this->getPayload('GetPumpNozzlesConfiguration', []);
        $response = $this->sendRequest($payload);

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

        $payload = $this->getPayload('PumpAuthorize', $validated);
        return $this->sendRequest($payload);
    }

    public function stopPump(Request $request)
    {
        $validated = $request->validate([
            'Pump' => 'required|integer|min:1|max:50',
        ]);

        $payload = $this->getPayload('PumpStop', $validated);
        return $this->sendRequest($payload);
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

        $payload = $this->getPayload('PumpStop', $packets);
        return $this->sendRequest($payload);
    }

    public function emergencyStopPump(Request $request)
    {
        $validated = $request->validate([
            'Pump' => 'required|integer|min:1|max:50',
        ]);

        $payload = $this->getPayload('PumpEmergencyStop', $validated);
        return $this->sendRequest($payload);
    }

    public function suspendPump(Request $request)
    {
        $validated = $request->validate([
            'Pump' => 'required|integer|min:1|max:50',
        ]);

        $payload = $this->getPayload('PumpSuspend', $validated);
        return $this->sendRequest($payload);
    }

    public function resumePump(Request $request)
    {
        $validated = $request->validate([
            'Pump' => 'required|integer|min:1|max:50',
        ]);

        $payload = $this->getPayload('PumpResume', $validated);
        return $this->sendRequest($payload);
    }

    public function getPumpDeliveries($pumpId)
    {
        $pumpDeliveries = PumpDelivery::where('Pump', $pumpId)->get();
        return response()->json($pumpDeliveries);
    }
}
