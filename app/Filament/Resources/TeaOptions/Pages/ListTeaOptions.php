<?php

namespace App\Filament\Resources\TeaOptions\Pages;

use App\Filament\Resources\TeaOptions\TeaOptionResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListTeaOptions extends ListRecords
{
    protected static string $resource = TeaOptionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
