<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CashierController;
use App\Http\Controllers\DiscountController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PumpController;
use App\Http\Controllers\FinalisationController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\PrinterController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\ElectricJournalController;
use App\Http\Controllers\PeriodController;
use App\Models\HoseHistory;

// Public Routes
Route::get('/', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::post('/', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Authenticated Routesf
Route::middleware('auth:cashier')->group(function () {
    Route::get('/home', function () {
        return Inertia::render('Home');
    })->name('home');

    // PumpController
    Route::get('/get-pump-status', [PumpController::class, 'getPumpStatus']);
    Route::post('/authorize-pump', [PumpController::class, 'authorizePump']);
    Route::post('/stop-pump', [PumpController::class, 'stopPump']);
    Route::post('/emergency-stop', [PumpController::class, 'emergencyStopPump']);
    Route::post('/suspend', [PumpController::class, 'suspendPump']);
    Route::post('/resume', [PumpController::class, 'resumePump']);
    Route::get('/pump-deliveries/{pumpId}', [PumpController::class, 'getPumpDeliveries']);
    Route::post('/stop-all-pumps', [PumpController::class, 'stopAllPumps']);
    Route::post('/authorize-all-pumps', [PumpController::class, 'authorizeAllPumps']);
    Route::match(['get', 'post'], '/restart-pts', [PumpController::class, 'restartPTSController']);
    // Route::get('/get-pump-nozzle', [PumpController::class, 'getPumpNozzlesConfiguration']);
    // Route::post('/set-pump-nozzle', [PumpController::class, 'setPumpNozzlesConfiguration']);
    Route::post('/set-fuel-grades', [PumpController::class, 'setFuelGradesConfiguration']);
    Route::get('/get-fuel-grades', [PumpController::class, 'getFuelGradesConfiguration']);
    // Route::get('/get-users', [PumpController::class, 'getUserConfiguration']);
    // Route::match(['get', 'post'], '/set-users', [PumpController::class, 'setUserConfiguration']);

    // FinalisationController
    Route::get('/get-mop', [FinalisationController::class, 'getMOP'])->name('getMOP');

    // TransactionController
    Route::post('/store-transactions', [TransactionController::class, 'storeTransaction']);
    Route::get('/receipt/{transactionId}', [TransactionController::class, 'getReceipt']);
    Route::get('/print-receipt/{transactionId}', [TransactionController::class, 'printReceipt']);
    Route::post('/save-card-details', [TransactionController::class, 'saveCardDetails']);

    // GradeController
    // Route::post('/store-grades', [GradeController::class, 'getFuelGrades']);
    // Route::get('/get-grades', [GradeController::class, 'getFuelGrades']);

    // Route::get('/get-grades', [GradeController::class, 'getGrades']);
    // Route::put('/update-price/{gradeId}', [GradeController::class, 'updatePrice']);

    // CashierController
    Route::get('/cashiers', [CashierController::class, 'getAllCashier']);
    Route::get('/cashier-name', [CashierController::class, 'getLoggedInCashier']);

    // Printer Controller
    Route::get('/printer-status', [PrinterController::class, 'checkPrinterStatus']);
    Route::post('/print-data', [PrinterController::class, 'printData']);
    Route::get('/open-cash-drawer', [PrinterController::class, 'openCashDrawer']);

    // Electronic Journal Controller
    Route::get('/get-journals', [ElectricJournalController::class, 'getJournal']);

    // DiscountController
    Route::get('/get-discount', [DiscountController::class, 'getDiscount']);

    // PeriodController
    Route::get('/period', [PeriodController::class, 'getCshrActShiftPeriod']);
    Route::post('/close-shift', [PeriodController::class, 'closePeriod']);
    Route::get('/get-all-period', [PeriodController::class, 'getAllPeriod']);
    Route::get('/get-report-data', [PeriodController::class, 'getPeriodReport']);
});

Route::get('/test-print', [TestController::class, 'testPrint']);
Route::get('/getitemstype', [TestController::class, 'getItemtype']);
Route::get('/test-job', [TestController::class, 'dispatchJob']);

// Route::get('/fuel-sales-discount/{periodID}', function ($periodID) {
//     $hoseHistory = new HoseHistory();
//     $result = $hoseHistory->getFuelSalesDisc($periodID);

//     if ($result) {
//         return response()->json($result);
//     }

//     return response()->json(['message' => 'No data found for this period.'], 404);
// });

// Route::get('/fuel-sales/{periodID}', function ($periodID) {
//     $hoseHistory = new HoseHistory();
//     $fuelSales = $hoseHistory->getFuelSales($periodID);

//     if ($fuelSales) {
//         return response()->json($fuelSales); // Return the result as JSON
//     }

//     return response()->json(['message' => 'No data found for this period.'], 404);
// });
