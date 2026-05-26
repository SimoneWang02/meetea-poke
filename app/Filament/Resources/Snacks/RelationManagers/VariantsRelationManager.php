<?php

namespace App\Filament\Resources\Snacks\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
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
                Toggle::make('mix_gusti')
                    ->label('Permetti mix gusti')
                    ->helperText('Il cliente sceglie un gusto per ogni pezzo')
                    ->default(false)
                    ->live(),
                TextInput::make('num_pz')
                    ->label('Numero di pezzi')
                    ->helperText('Quanti gusti può scegliere il cliente')
                    ->numeric()
                    ->minValue(1)
                    ->maxValue(20)
                    ->required(fn ($get) => $get('mix_gusti'))
                    ->visible(fn ($get) => $get('mix_gusti')),
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
                IconColumn::make('mix_gusti')->label('Mix gusti')->boolean(),
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
