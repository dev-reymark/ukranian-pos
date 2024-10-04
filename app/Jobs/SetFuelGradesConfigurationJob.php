<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SetFuelGradesConfigurationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $payload;

    /**
     * Create a new job instance.
     */
    public function __construct($payload)
    {
        $this->payload = $payload;
    }

    /**
     * Get the API URL from the config.
     */
    private function getApiUrl()
    {
        return config('services.pts_api.url');
    }

    /**
     * Execute the job.
     */
    public function handle()
    {

        Log::info('Job is being processed');

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => 'Basic ' . base64_encode('admin:admin')
            ])->post($this->getApiUrl(), $this->payload);

            if (!$response->successful()) {
                // Handle error response
                Log::error('Failed to update fuel grades configuration', [
                    'response' => $response->body(),
                    'status_code' => $response->status(),
                ]);
            } else {
                Log::info('Successfully updated fuel grades configuration', [
                    'response' => $response->json(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Exception occurred while sending fuel grades configuration', [
                'error' => $e->getMessage(),
            ]);
        }
    }
}
