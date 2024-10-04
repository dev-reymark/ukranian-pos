<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Carbon\Carbon;

class LongRunningCommand extends Command
{
    protected $signature = 'long:running';
    protected $description = 'Run a long-running command that checks for price updates.';

    public function handle()
    {
        $this->info('Long-running command started. Checking for price updates...');

        while (true) {
            // Call the check-and-update command
            Artisan::call('price:check-and-update');
            
            // Optional: Output the result of the command
            $this->info(Artisan::output());

            // Wait for a specified interval before checking again (e.g., every minute)
            sleep(60); // Sleep for 60 seconds
        }
    }
}
