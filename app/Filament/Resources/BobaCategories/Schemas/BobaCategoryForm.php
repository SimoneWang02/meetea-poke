<?php

namespace App\Filament\Resources\BobaCategories\Schemas;

use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class BobaCategoryForm
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
                    ->label('Slug')
                    ->required(),
                Toggle::make('active')
                    ->label('Attiva')
                    ->default(true),
                TagsInput::make('basi')
                    ->label('Basi disponibili')
                    ->placeholder('Aggiungi base...')
                    ->helperText('Opzioni base selezionabili dal cliente (es. Granita, Tè Verde Normale)'),
            ]);
    }
}
