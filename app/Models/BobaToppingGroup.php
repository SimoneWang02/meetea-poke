<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BobaToppingGroup extends Model
{
    protected $fillable = [
        'slug',
        'nome',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function toppings(): HasMany
    {
        return $this->hasMany(BobaTopping::class, 'group_id');
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
