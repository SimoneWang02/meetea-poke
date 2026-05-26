<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BobaTopping extends Model
{
    protected $fillable = [
        'group_id',
        'parent_id',
        'nome',
        'sort_order',
        'active',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'active' => 'boolean',
    ];

    public function group(): BelongsTo
    {
        return $this->belongsTo(BobaToppingGroup::class, 'group_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(BobaTopping::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(BobaTopping::class, 'parent_id');
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
