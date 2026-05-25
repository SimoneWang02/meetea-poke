<?php

namespace App\Filament\Resources\PokeSizes\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PokeSizesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                TextColumn::make('nome')
                    ->label('Nome')
                    ->searchable(),
                TextColumn::make('prezzo')
                    ->label('Prezzo')
                    ->money('EUR')
                    ->sortable(),
                TextColumn::make('max_proteine')->label('Proteine')->numeric(),
                TextColumn::make('max_green')->label('Green')->numeric(),
                TextColumn::make('max_crispy')->label('Crispy')->numeric(),
                TextColumn::make('max_salse')->label('Salse')->numeric(),
                IconColumn::make('active')
                    ->label('Attivo')
                    ->boolean(),
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
