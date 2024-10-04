<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\PriceProfile;
use Carbon\Carbon;

// Artisan::command('inspire', function () {
//     $this->comment(Inspiring::quote());
// })->purpose('Display an inspiring quote')->hourly();

// Schedule the command to run every minute
Artisan::command('price:check-and-update', function () {
    $this->info('Checking for price updates...');

    // Get the profiles that are due for update
    $profiles = PriceProfile::where('Scheduled_ST', '<=', Carbon::now())->get();

    if ($profiles->isEmpty()) {
        $this->info('No profiles due for update at this time.');
        return;
    }

    foreach ($profiles as $profile) {
        $this->info('Processing Price Profile ID: ' . $profile->Price_Profile_ID);

        // Call the price update command
        Artisan::call('price:update', ['profileId' => $profile->Price_Profile_ID]);
        $this->info('Price update command executed for profile ID: ' . $profile->Price_Profile_ID);
    }
})->everySecond();
