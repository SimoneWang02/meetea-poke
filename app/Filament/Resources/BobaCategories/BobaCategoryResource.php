<?php

namespace App\Filament\Resources\BobaCategories;

use App\Filament\Resources\BobaCategories\Pages\CreateBobaCategory;
use App\Filament\Resources\BobaCategories\Pages\EditBobaCategory;
use App\Filament\Resources\BobaCategories\Pages\ListBobaCategories;
use App\Filament\Resources\BobaCategories\RelationManagers\DrinksRelationManager;
use App\Filament\Resources\BobaCategories\Schemas\BobaCategoryForm;
use App\Filament\Resources\BobaCategories\Tables\BobaCategoriesTable;
use App\Models\BobaCategory;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class BobaCategoryResource extends Resource
{
    protected static ?string $model = BobaCategory::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSparkles;

    protected static string|UnitEnum|null $navigationGroup = 'Bubble Tea';

    protected static ?int $navigationSort = 1;

    protected static ?string $modelLabel = 'Categoria';

    protected static ?string $pluralModelLabel = 'Categorie';

    protected static ?string $recordTitleAttribute = 'nome';

    public static function form(Schema $schema): Schema
    {
        return BobaCategoryForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BobaCategoriesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            DrinksRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListBobaCategories::route('/'),
            'create' => CreateBobaCategory::route('/create'),
            'edit' => EditBobaCategory::route('/{record}/edit'),
        ];
    }
}
