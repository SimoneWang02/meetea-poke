<?php

namespace App\Providers;

use App\Models\BobaCategory;
use App\Models\BobaDrink;
use App\Models\BobaDrinkSize;
use App\Models\BobaTopping;
use App\Models\BobaToppingGroup;
use App\Models\PokeIngredient;
use App\Models\PokeIngredientGroup;
use App\Models\PokeSize;
use App\Models\Snack;
use App\Models\SnackVariant;
use App\Models\TeaOption;
use App\Observers\MenuCacheObserver;
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

        foreach ([
            PokeSize::class,
            PokeIngredientGroup::class,
            PokeIngredient::class,
            BobaCategory::class,
            BobaDrink::class,
            BobaDrinkSize::class,
            BobaToppingGroup::class,
            BobaTopping::class,
            TeaOption::class,
            Snack::class,
            SnackVariant::class,
        ] as $model) {
            $model::observe(MenuCacheObserver::class);
        }
    }
}
