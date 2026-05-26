<?php

namespace App\Filament\Resources\PokeSizes\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class PokeSizeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('nome')
                    ->label('Nome')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn (string $state, callable $set) => $set('slug', Str::slug($state))),
                TextInput::make('slug')
                    ->hidden()
                    ->dehydrated(),
                TextInput::make('prezzo')
                    ->label('Prezzo (€)')
                    ->required()
                    ->inputMode('decimal')
                    ->rules(['regex:/^\d+([.,]\d{1,2})?$/'])
                    ->dehydrateStateUsing(fn ($state) => $state !== null && $state !== '' ? (float) str_replace(',', '.', (string) $state) : $state)
                    ->prefix('€'),
                TextInput::make('max_proteine')
                    ->label('Max proteine incluse')
                    ->required()
                    ->numeric()
                    ->minValue(0),
                TextInput::make('max_green')
                    ->label('Max green inclusi')
                    ->required()
                    ->numeric()
                    ->minValue(0),
                TextInput::make('max_crispy')
                    ->label('Max crispy inclusi')
                    ->required()
                    ->numeric()
                    ->minValue(0),
                TextInput::make('max_salse')
                    ->label('Max salse incluse')
                    ->required()
                    ->numeric()
                    ->minValue(0),
                Toggle::make('active')
                    ->label('Attivo')
                    ->default(true),
            ]);
    }
}
