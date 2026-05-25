<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BobaDrinkSize extends Model
{
    protected $fillable = [
        'drink_id',
        'size',
        'prezzo',
    ];

    protected $casts = [
        'prezzo' => 'decimal:2',
    ];

    public function drink(): BelongsTo
    {
        return $this->belongsTo(BobaDrink::class, 'drink_id');
    }
}
