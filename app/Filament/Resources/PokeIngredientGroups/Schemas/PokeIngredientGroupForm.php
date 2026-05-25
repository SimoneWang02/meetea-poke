<?php

namespace App\Filament\Resources\PokeIngredientGroups\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class PokeIngredientGroupForm
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
