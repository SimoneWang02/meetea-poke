<?php

namespace App\Filament\Resources\Bevande;

use App\Filament\Resources\Bevande\Pages\CreateBevanda;
use App\Filament\Resources\Bevande\Pages\EditBevanda;
use App\Filament\Resources\Bevande\Pages\ListBevande;
use App\Filament\Resources\Bevande\Schemas\BevandaForm;
use App\Filament\Resources\Bevande\Tables\BevandeTable;
use App\Models\Bevanda;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class BevandaResource extends Resource
{
    protected static ?string $model = Bevanda::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBeaker;

    protected static string|UnitEnum|null $navigationGroup = 'Bevande';

    protected static ?int $navigationSort = 1;

    protected static ?string $modelLabel = 'Bevanda';

    protected static ?string $pluralModelLabel = 'Bevande';

    protected static ?string $slug = 'bevande';

    protected static ?string $recordTitleAttribute = 'nome';

    public static function form(Schema $schema): Schema
    {
        return BevandaForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BevandeTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListBevande::route('/'),
            'create' => CreateBevanda::route('/create'),
            'edit' => EditBevanda::route('/{record}/edit'),
        ];
    }
}
