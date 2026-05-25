<?php

namespace App\Filament\Resources\PokeIngredientGroups;

use App\Filament\Resources\PokeIngredientGroups\Pages\CreatePokeIngredientGroup;
use App\Filament\Resources\PokeIngredientGroups\Pages\EditPokeIngredientGroup;
use App\Filament\Resources\PokeIngredientGroups\Pages\ListPokeIngredientGroups;
use App\Filament\Resources\PokeIngredientGroups\RelationManagers\IngredientsRelationManager;
use App\Filament\Resources\PokeIngredientGroups\Schemas\PokeIngredientGroupForm;
use App\Filament\Resources\PokeIngredientGroups\Tables\PokeIngredientGroupsTable;
use App\Models\PokeIngredientGroup;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class PokeIngredientGroupResource extends Resource
{
    protected static ?string $model = PokeIngredientGroup::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|UnitEnum|null $navigationGroup = 'Poke';

    protected static ?int $navigationSort = 2;

    protected static ?string $modelLabel = 'Gruppo ingredienti';

    protected static ?string $pluralModelLabel = 'Gruppi ingredienti';

    protected static ?string $recordTitleAttribute = 'nome';

    public static function form(Schema $schema): Schema
    {
        return PokeIngredientGroupForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PokeIngredientGroupsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            IngredientsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListPokeIngredientGroups::route('/'),
            'create' => CreatePokeIngredientGroup::route('/create'),
            'edit' => EditPokeIngredientGroup::route('/{record}/edit'),
        ];
    }
}
