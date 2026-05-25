<?php

namespace App\Filament\Resources\TeaOptions\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class TeaOptionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('gruppo')
                    ->label('Gruppo')
                    ->options([
                        'basi' => 'Basi',
                        'latte' => 'Latte',
                        'pearls' => 'Pearls',
                        'dolcezza' => 'Dolcezza',
                        'ghiaccio' => 'Ghiaccio',
                    ])
                    ->required(),
                TextInput::make('nome')
                    ->label('Nome')
                    ->required(),
                Toggle::make('active')->label('Attiva')->default(true),
            ]);
    }
}
