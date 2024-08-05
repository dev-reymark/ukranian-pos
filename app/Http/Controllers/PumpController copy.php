<?php

namespace App\Http\Controllers;

use App\Models\PumpDelivery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PumpController extends Controller
{
    public function getPumpStatus(Request $request)
    {
        // Create an array of packets dynamically
        $packets = [];
        $pumpCount = 20;

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

            foreach ($packets as $packet) {
                if ($packet['Type'] === 'PumpEndOfTransactionStatus') {
                    $pumpData = $packet['Data'];
                    Log::info('Pump Data:', $pumpData);

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
                    ]);
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

    public function getPumpDeliveries($pumpId)
    {
        $pumpDeliveries = PumpDelivery::where('Pump', $pumpId)->get();
        return response()->json($pumpDeliveries);
    }
}
