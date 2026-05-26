<?php

namespace App\Filament\Resources\Bevande\Pages;

use App\Filament\Resources\Bevande\BevandaResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListBevande extends ListRecords
{
    protected static string $resource = BevandaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
