<?php

namespace App\Filament\Resources\PokeIngredientGroups\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class PokeIngredientGroupForm
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
                TextInput::make('prezzo_extra')
                    ->label('Prezzo extra per ingrediente oltre il massimo (€)')
                    ->required()
                    ->numeric()
                    ->step(0.01)
                    ->prefix('€')
                    ->default(0),
            ]);
    }
}
