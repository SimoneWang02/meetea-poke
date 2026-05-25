<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SnackVariant extends Model
{
    protected $fillable = [
        'snack_id',
        'qty',
        'prezzo',
        'sort_order',
    ];

    protected $casts = [
        'prezzo' => 'decimal:2',
        'sort_order' => 'integer',
    ];

    public function snack(): BelongsTo
    {
        return $this->belongsTo(Snack::class);
    }
}
