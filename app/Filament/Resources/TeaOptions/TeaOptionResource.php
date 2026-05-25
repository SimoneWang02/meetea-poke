<?php

namespace App\Filament\Resources\TeaOptions;

use App\Filament\Resources\TeaOptions\Pages\CreateTeaOption;
use App\Filament\Resources\TeaOptions\Pages\EditTeaOption;
use App\Filament\Resources\TeaOptions\Pages\ListTeaOptions;
use App\Filament\Resources\TeaOptions\Schemas\TeaOptionForm;
use App\Filament\Resources\TeaOptions\Tables\TeaOptionsTable;
use App\Models\TeaOption;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class TeaOptionResource extends Resource
{
    protected static ?string $model = TeaOption::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedAdjustmentsHorizontal;

    protected static string|UnitEnum|null $navigationGroup = 'Bubble Tea';

    protected static ?int $navigationSort = 4;

    protected static ?string $modelLabel = 'Personalizzazione tè';

    protected static ?string $pluralModelLabel = 'Personalizzazioni tè';

    protected static ?string $recordTitleAttribute = 'nome';

    public static function form(Schema $schema): Schema
    {
        return TeaOptionForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return TeaOptionsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListTeaOptions::route('/'),
            'create' => CreateTeaOption::route('/create'),
            'edit' => EditTeaOption::route('/{record}/edit'),
        ];
    }
}
