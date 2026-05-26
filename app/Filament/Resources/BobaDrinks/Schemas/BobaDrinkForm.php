<?php

namespace App\Filament\Resources\BobaDrinks\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class BobaDrinkForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('category_id')
                    ->label('Categoria')
                    ->relationship('category', 'nome')
                    ->required()
                    ->searchable()
                    ->preload(),
                TextInput::make('nome')
                    ->label('Nome')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn (string $state, callable $set) => $set('slug', Str::slug($state))),
                TextInput::make('slug')
                    ->label('Slug')
                    ->required(),
                Textarea::make('ingredienti')
                    ->label('Ingredienti')
                    ->rows(2)
                    ->columnSpanFull(),
                FileUpload::make('image_path')
                    ->label('Immagine')
                    ->image()
                    ->disk('public')
                    ->directory('menu/boba')
                    ->columnSpanFull(),
                Toggle::make('active')->label('Attivo')->default(true),
            ]);
    }
}
