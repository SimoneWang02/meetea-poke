<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Snack extends Model
{
    protected $fillable = [
        'slug',
        'nome',
        'image_path',
        'sort_order',
        'active',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'active' => 'boolean',
    ];

    public function variants(): HasMany
    {
        return $this->hasMany(SnackVariant::class);
    }

    public function flavors(): HasMany
    {
        return $this->hasMany(SnackFlavor::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
