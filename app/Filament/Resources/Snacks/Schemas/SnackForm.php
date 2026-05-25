<?php

namespace App\Filament\Resources\Snacks\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class SnackForm
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
                FileUpload::make('image_path')
                    ->label('Immagine')
                    ->image()
                    ->disk('public')
                    ->directory('menu/snacks')
                    ->columnSpanFull(),
                Toggle::make('active')->label('Attivo')->default(true),
            ]);
    }
}
