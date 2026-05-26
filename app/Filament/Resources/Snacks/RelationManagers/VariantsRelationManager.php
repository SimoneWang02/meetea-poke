<?php

namespace App\Filament\Resources\Snacks\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class VariantsRelationManager extends RelationManager
{
    protected static string $relationship = 'variants';

    protected static ?string $title = 'Varianti';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('qty')
                    ->label('Quantità (es. "6pz", "1 Porzione")')
                    ->required()
                    ->maxLength(255),
                TextInput::make('prezzo')
                    ->label('Prezzo (€)')
                    ->required()
                    ->inputMode('decimal')
                    ->rules(['regex:/^\d+([.,]\d{1,2})?$/'])
                    ->dehydrateStateUsing(fn ($state) => $state !== null && $state !== '' ? (float) str_replace(',', '.', (string) $state) : $state)
                    ->prefix('€'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('qty')
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                TextColumn::make('qty')->label('Quantità'),
                TextColumn::make('prezzo')->label('Prezzo')->money('EUR'),
            ])
            ->headerActions([
                CreateAction::make(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
