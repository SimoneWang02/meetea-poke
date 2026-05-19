<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::post('/orders', [OrderController::class, 'store']);
Route::post('/admin/login', [AdminController::class, 'login']);

Route::middleware('admin')->group(function () {
    Route::get('/orders', [OrderController::class, 'index']);
    Route::patch('/orders/{order}/stato', [OrderController::class, 'updateStato']);
});
