<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PriceProfile;
use App\Models\Grade;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;

class PriceUpdate extends Command
{
    protected $signature = 'price:update {profileId}';
    protected $description = 'Update fuel prices at the scheduled time';

    private function getApiUrl()
    {
        return config('services.pts_api.url');
    }

    public function handle()
    {
        $profileId = $this->argument('profileId');

        // Fetch the Price Profile by its ID
        $priceProfile = PriceProfile::find($profileId);

        if (!$priceProfile) {
            $this->error('Price profile not found.');
            return;
        }

        // Ensure the Scheduled_ST is a Carbon instance
        $scheduledTime = Carbon::parse($priceProfile->Scheduled_ST);

        // Check if the scheduled time is past or now
        if (Carbon::now()->lt($scheduledTime)) {
            $this->error('Cannot apply prices before the scheduled time.');
            return;
        }

        // Prepare an array to hold all the FuelGrades for the payload
        $fuelGrades = [];

        // Fetch all grades and their corresponding Price Profiles
        $grades = Grade::with('priceProfile')->get(); // Assuming a relationship is defined

        foreach ($grades as $grade) {
            // Map the prices based on the Price_Profile_ID
            $priceProfile = PriceProfile::find($grade->Price_Profile_ID);

            if ($priceProfile) {
                $fuelGrades[] = [
                    'Id' => $grade->Grade_ID,
                    'Name' => $grade->Grade_Name,
                    'Price' => $priceProfile->Grade_Price,
                    'ExpansionCoefficient' => $priceProfile->ExpansionCoefficient, // Include if needed
                    // 'isSelected' => $grade->Price_Profile_ID === $profileId, // Mark as selected if it's the current profile
                ];
            }
        }

        // Prepare the payload for the HTTP request
        $payload = [
            'Protocol' => 'jsonPTS',
            'Packets' => [
                [
                    'Id' => $profileId,
                    'Type' => 'SetFuelGradesConfiguration',
                    'Data' => [
                        'FuelGrades' => $fuelGrades,
                    ],
                ],
            ],
        ];

        // Send the HTTP request to set fuel grades configuration
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => 'Basic ' . base64_encode('admin:admin'),
            ])->post($this->getApiUrl(), $payload);

            // Check if the request was successful
            if ($response->successful()) {
                $this->info('Fuel grades configuration updated successfully.');
            } else {
                $this->error('Failed to update fuel grades configuration: ' . $response->body());
            }
        } catch (\Exception $e) {
            $this->error('Exception occurred while updating fuel grades configuration: ' . $e->getMessage());
        }
    }
}
