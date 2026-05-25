<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\OrderController;
use App\Http\Middleware\PrintAuth;
use Illuminate\Support\Facades\Route;

Route::post('/orders', [OrderController::class, 'store'])->middleware('throttle:orders');
Route::post('/admin/login', [AdminController::class, 'login']);

Route::middleware('admin')->group(function () {
    Route::get('/orders', [OrderController::class, 'index']);
    Route::patch('/orders/{order}/stato', [OrderController::class, 'updateStato']);
});

Route::middleware(PrintAuth::class)->group(function () {
    Route::get('/print-queue', [OrderController::class, 'printQueue']);
    Route::get('/recent-orders', [OrderController::class, 'recentOrders']);
    Route::post('/orders/{order}/stampa', [OrderController::class, 'markStampato']);
});
