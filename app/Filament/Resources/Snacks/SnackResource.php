<?php

namespace App\Filament\Resources\Snacks;

use App\Filament\Resources\Snacks\Pages\CreateSnack;
use App\Filament\Resources\Snacks\Pages\EditSnack;
use App\Filament\Resources\Snacks\Pages\ListSnacks;
use App\Filament\Resources\Snacks\RelationManagers\FlavorsRelationManager;
use App\Filament\Resources\Snacks\RelationManagers\VariantsRelationManager;
use App\Filament\Resources\Snacks\Schemas\SnackForm;
use App\Filament\Resources\Snacks\Tables\SnacksTable;
use App\Models\Snack;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class SnackResource extends Resource
{
    protected static ?string $model = Snack::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCake;

    protected static string|UnitEnum|null $navigationGroup = 'Snack';

    protected static ?int $navigationSort = 1;

    protected static ?string $modelLabel = 'Snack';

    protected static ?string $pluralModelLabel = 'Snack';

    protected static ?string $recordTitleAttribute = 'nome';

    public static function form(Schema $schema): Schema
    {
        return SnackForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SnacksTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            VariantsRelationManager::class,
            FlavorsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSnacks::route('/'),
            'create' => CreateSnack::route('/create'),
            'edit' => EditSnack::route('/{record}/edit'),
        ];
    }
}
