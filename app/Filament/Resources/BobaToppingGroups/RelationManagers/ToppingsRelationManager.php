<?php

namespace App\Filament\Resources\BobaToppingGroups\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ToppingsRelationManager extends RelationManager
{
    protected static string $relationship = 'toppings';

    protected static ?string $title = 'Topping';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('nome')
                    ->label('Nome')
                    ->required()
                    ->maxLength(255),
                Select::make('parent_id')
                    ->label('Topping genitore (per gusti)')
                    ->relationship(
                        name: 'parent',
                        titleAttribute: 'nome',
                        modifyQueryUsing: fn ($query, $livewire) => $query
                            ->where('group_id', $livewire->getOwnerRecord()->id)
                            ->whereNull('parent_id'),
                    )
                    ->searchable()
                    ->preload()
                    ->placeholder('Topping principale (nessun genitore)'),
                Toggle::make('active')->label('Attivo')->default(true),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('nome')
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                TextColumn::make('nome')->label('Nome')->searchable(),
                TextColumn::make('parent.nome')->label('Genitore')->placeholder('-'),
                IconColumn::make('active')->label('Attivo')->boolean(),
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
