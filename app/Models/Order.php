<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'numero_ordine',
        'nome_cliente',
        'telefono',
        'orario_ritiro',
        'note',
        'stato',
        'stampato',
    ];

    protected $casts = [
        'stampato' => 'boolean',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
