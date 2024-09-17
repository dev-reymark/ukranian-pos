<?php

use App\Http\Controllers\APIController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TransactionController;

Route::middleware('auth.basic')->group(function () {
});

Route::get('/transactions', [APIController::class, 'getTransactions']);
Route::post('/transactions', [APIController::class, 'saveTransaction']);