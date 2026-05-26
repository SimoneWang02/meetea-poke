<?php

namespace App\Filament\Resources\Bevande\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class BevandaForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('nome')
                    ->label('Nome')
                    ->required(),
                TextInput::make('prezzo')
                    ->label('Prezzo (€)')
                    ->numeric()
                    ->required()
                    ->minValue(0)
                    ->step(0.01),
                FileUpload::make('image_path')
                    ->label('Immagine')
                    ->image()
                    ->disk('public')
                    ->directory('menu/bevande')
                    ->columnSpanFull(),
                Toggle::make('active')->label('Attivo')->default(true),
            ]);
    }
}
