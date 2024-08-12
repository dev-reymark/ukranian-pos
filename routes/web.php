<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CashierController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PumpController;
use App\Http\Controllers\FinalisationController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\PrinterController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\ElectricJournalController;

// Public Routes
Route::get('/', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Authenticated Routes
Route::middleware('auth:cashier')->group(function () {
    Route::get('/home', function () {
        return Inertia::render('Home');
    })->name('home');

    // PumpController
    Route::get('/get-pump-status', [PumpController::class, 'getPumpStatus'])->name('getPumpStatus');
    Route::post('/authorize-pump', [PumpController::class, 'authorizePump'])->name('authorizePump');
    Route::post('/stop-pump', [PumpController::class, 'stopPump']);
    Route::post('/emergency-stop', [PumpController::class, 'emergencyStopPump']);
    Route::post('/suspend', [PumpController::class, 'suspendPump']);
    Route::post('/resume', [PumpController::class, 'resumePump']);
    Route::get('/pump-deliveries/{pumpId}', [PumpController::class, 'getPumpDeliveries']);
    Route::get('/get-fuel-grades', [PumpController::class, 'getFuelGradesConfiguration'])->name('fuel.grades');
    Route::get('/get-pump-nozzle', [PumpController::class, 'getNozzlesConfiguration']);
    Route::post('/stop-all-pumps', [PumpController::class, 'stopAllPumps']);

    // FinalisationController
    Route::get('/get-mop', [FinalisationController::class, 'getMOP'])->name('getMOP');

    // TransactionController
    Route::post('/store-transactions', [TransactionController::class, 'storeTransaction']);
    Route::get('/receipt/{transactionId}', [TransactionController::class, 'getReceipt']);
    Route::get('/print-receipt/{transactionId}', [TransactionController::class, 'printReceipt']);

    // GradeController
    Route::post('/store-grades', [GradeController::class, 'getFuelGrades']);
    Route::get('/get-grades', [GradeController::class, 'getFuelGrades']);

    // CashierController
    Route::get('/cashiers', [CashierController::class, 'getAllCashier']);
    Route::get('/cashier-name', [CashierController::class, 'getLoggedInCashier']);

    // Printer Controller
    Route::get('/printer-status', [PrinterController::class, 'checkPrinterStatus']);

    // Electronic Journal Controller
    Route::get('/get-journals', [ElectricJournalController::class, 'getJournal']);
});

Route::get('/test-print', [TestController::class, 'testPrint']);
Route::get('/getitemstype', [TestController::class, 'getItemtype']);

Route::get('/cashiers', [CashierController::class, 'getAllCashier']);
