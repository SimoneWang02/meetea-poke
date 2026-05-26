<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Bevanda extends Model
{
    protected $table = 'bevande';

    protected $fillable = [
        'nome',
        'prezzo',
        'image_path',
        'sort_order',
        'active',
    ];

    protected $casts = [
        'prezzo' => 'decimal:2',
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
