<?php

namespace App\Filament\Resources\BobaDrinks\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class BobaDrinksTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                ImageColumn::make('image_path')->label('')->disk('public')->square(),
                TextColumn::make('nome')->label('Nome')->searchable(),
                TextColumn::make('category.nome')->label('Categoria')->sortable(),
                IconColumn::make('active')->label('Attivo')->boolean(),
            ])
            ->filters([
                SelectFilter::make('category_id')
                    ->label('Categoria')
                    ->relationship('category', 'nome'),
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
