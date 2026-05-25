<?php

namespace App\Observers;

use App\Http\Controllers\MenuController;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class MenuCacheObserver
{
    public function saved(Model $model): void
    {
        Cache::forget(MenuController::CACHE_KEY);
    }

    public function deleted(Model $model): void
    {
        Cache::forget(MenuController::CACHE_KEY);
    }
}
