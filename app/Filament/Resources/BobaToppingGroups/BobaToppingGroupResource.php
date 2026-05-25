<?php

namespace App\Filament\Resources\BobaToppingGroups;

use App\Filament\Resources\BobaToppingGroups\Pages\CreateBobaToppingGroup;
use App\Filament\Resources\BobaToppingGroups\Pages\EditBobaToppingGroup;
use App\Filament\Resources\BobaToppingGroups\Pages\ListBobaToppingGroups;
use App\Filament\Resources\BobaToppingGroups\RelationManagers\ToppingsRelationManager;
use App\Filament\Resources\BobaToppingGroups\Schemas\BobaToppingGroupForm;
use App\Filament\Resources\BobaToppingGroups\Tables\BobaToppingGroupsTable;
use App\Models\BobaToppingGroup;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class BobaToppingGroupResource extends Resource
{
    protected static ?string $model = BobaToppingGroup::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSquare3Stack3d;

    protected static string|UnitEnum|null $navigationGroup = 'Bubble Tea';

    protected static ?int $navigationSort = 3;

    protected static ?string $modelLabel = 'Gruppo topping';

    protected static ?string $pluralModelLabel = 'Gruppi topping';

    protected static ?string $recordTitleAttribute = 'nome';

    public static function form(Schema $schema): Schema
    {
        return BobaToppingGroupForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BobaToppingGroupsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            ToppingsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListBobaToppingGroups::route('/'),
            'create' => CreateBobaToppingGroup::route('/create'),
            'edit' => EditBobaToppingGroup::route('/{record}/edit'),
        ];
    }
}
