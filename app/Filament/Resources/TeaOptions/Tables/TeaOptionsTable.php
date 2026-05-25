<?php

namespace App\Filament\Resources\TeaOptions\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class TeaOptionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                TextColumn::make('gruppo')->label('Gruppo')->badge(),
                TextColumn::make('nome')->label('Nome')->searchable(),
                IconColumn::make('active')->label('Attiva')->boolean(),
            ])
            ->filters([
                SelectFilter::make('gruppo')
                    ->label('Gruppo')
                    ->options([
                        'basi' => 'Basi',
                        'latte' => 'Latte',
                        'pearls' => 'Pearls',
                        'dolcezza' => 'Dolcezza',
                        'ghiaccio' => 'Ghiaccio',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
