<?php

namespace App\Filament\Resources\PokeSizes;

use App\Filament\Resources\PokeSizes\Pages\CreatePokeSize;
use App\Filament\Resources\PokeSizes\Pages\EditPokeSize;
use App\Filament\Resources\PokeSizes\Pages\ListPokeSizes;
use App\Filament\Resources\PokeSizes\Schemas\PokeSizeForm;
use App\Filament\Resources\PokeSizes\Tables\PokeSizesTable;
use App\Models\PokeSize;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class PokeSizeResource extends Resource
{
    protected static ?string $model = PokeSize::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|UnitEnum|null $navigationGroup = 'Poke';

    protected static ?int $navigationSort = 1;

    protected static ?string $modelLabel = 'Dimensione';

    protected static ?string $pluralModelLabel = 'Dimensioni';

    protected static ?string $recordTitleAttribute = 'nome';

    public static function form(Schema $schema): Schema
    {
        return PokeSizeForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PokeSizesTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListPokeSizes::route('/'),
            'create' => CreatePokeSize::route('/create'),
            'edit' => EditPokeSize::route('/{record}/edit'),
        ];
    }
}
