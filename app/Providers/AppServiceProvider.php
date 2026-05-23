<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        RateLimiter::for('orders', function (Request $request) {
            return Limit::perMinutes(10, 5)->by($request->ip())->response(function () {
                return response()->json(
                    ['message' => 'Troppi ordini in poco tempo. Riprova tra qualche minuto.'],
                    429
                );
            });
        });
    }
}
