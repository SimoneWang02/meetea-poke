<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PokeIngredient extends Model
{
    protected $fillable = [
        'group_id',
        'slug',
        'nome',
        'vegano',
        'sort_order',
        'active',
    ];

    protected $casts = [
        'vegano' => 'boolean',
        'active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function group(): BelongsTo
    {
        return $this->belongsTo(PokeIngredientGroup::class, 'group_id');
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
