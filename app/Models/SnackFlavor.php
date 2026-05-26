<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SnackFlavor extends Model
{
    protected $fillable = [
        'snack_id',
        'nome',
        'sort_order',
        'active',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'active' => 'boolean',
    ];

    public function snack(): BelongsTo
    {
        return $this->belongsTo(Snack::class);
    }
}
