<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BobaCategory extends Model
{
    protected $fillable = [
        'slug',
        'nome',
        'sort_order',
        'active',
        'basi',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'active' => 'boolean',
        'basi' => 'array',
    ];

    public function drinks(): HasMany
    {
        return $this->hasMany(BobaDrink::class, 'category_id');
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
