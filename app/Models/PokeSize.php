<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class PokeSize extends Model
{
    protected $fillable = [
        'slug',
        'nome',
        'prezzo',
        'max_proteine',
        'max_green',
        'max_crispy',
        'max_salse',
        'sort_order',
        'active',
    ];

    protected $casts = [
        'prezzo' => 'decimal:2',
        'max_proteine' => 'integer',
        'max_green' => 'integer',
        'max_crispy' => 'integer',
        'max_salse' => 'integer',
        'sort_order' => 'integer',
        'active' => 'boolean',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
