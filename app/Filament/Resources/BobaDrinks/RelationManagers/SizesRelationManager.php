<?php

namespace App\Filament\Resources\BobaDrinks\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SizesRelationManager extends RelationManager
{
    protected static string $relationship = 'sizes';

    protected static ?string $title = 'Formati e prezzi';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('size')
                    ->label('Formato')
                    ->options(['M' => 'M', 'G' => 'G'])
                    ->required(),
                TextInput::make('prezzo')
                    ->label('Prezzo (€)')
                    ->required()
                    ->numeric()
                    ->step(0.01)
                    ->prefix('€'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('size')
            ->columns([
                TextColumn::make('size')->label('Formato'),
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
