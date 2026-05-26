<?php

namespace App\Filament\Resources\PokeSizes\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class PokeSizeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('nome')
                    ->label('Nome')
                    ->required(),
                TextInput::make('slug')
                    ->label('Slug')
                    ->required(),
                TextInput::make('prezzo')
                    ->label('Prezzo (€)')
                    ->required()
                    ->numeric()
                    ->step(0.01)
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
