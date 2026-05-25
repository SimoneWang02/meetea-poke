<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PokeIngredientGroup extends Model
{
    protected $fillable = [
        'slug',
        'nome',
        'prezzo_extra',
        'sort_order',
    ];

    protected $casts = [
        'prezzo_extra' => 'decimal:2',
        'sort_order' => 'integer',
    ];

    public function ingredients(): HasMany
    {
        return $this->hasMany(PokeIngredient::class, 'group_id');
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
