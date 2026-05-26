<?php

namespace App\Filament\Resources\BobaDrinks;

use App\Filament\Resources\BobaDrinks\Pages\CreateBobaDrink;
use App\Filament\Resources\BobaDrinks\Pages\EditBobaDrink;
use App\Filament\Resources\BobaDrinks\Pages\ListBobaDrinks;
use App\Filament\Resources\BobaDrinks\RelationManagers\SizesRelationManager;
use App\Filament\Resources\BobaDrinks\Schemas\BobaDrinkForm;
use App\Filament\Resources\BobaDrinks\Tables\BobaDrinksTable;
use App\Models\BobaDrink;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class BobaDrinkResource extends Resource
{
    protected static ?string $model = BobaDrink::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBeaker;

    protected static string|UnitEnum|null $navigationGroup = 'Bubble Tea';

    protected static ?int $navigationSort = 2;

    protected static ?string $modelLabel = 'Bubble Tea';

    protected static ?string $pluralModelLabel = 'Bubble Tea';

    protected static ?string $recordTitleAttribute = 'nome';

    public static function form(Schema $schema): Schema
    {
        return BobaDrinkForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BobaDrinksTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            SizesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListBobaDrinks::route('/'),
            'create' => CreateBobaDrink::route('/create'),
            'edit' => EditBobaDrink::route('/{record}/edit'),
        ];
    }
}
