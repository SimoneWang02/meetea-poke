<?php

namespace App\Filament\Resources\PokeIngredientGroups\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PokeIngredientGroupsTable
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
                TextColumn::make('prezzo_extra')
                    ->label('Prezzo extra')
                    ->money('EUR'),
                TextColumn::make('ingredients_count')
                    ->label('Ingredienti')
                    ->counts('ingredients'),
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
