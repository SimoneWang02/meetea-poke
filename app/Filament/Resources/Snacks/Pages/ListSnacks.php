<?php

namespace App\Filament\Resources\Snacks\Pages;

use App\Filament\Resources\Snacks\SnackResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSnacks extends ListRecords
{
    protected static string $resource = SnackResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
