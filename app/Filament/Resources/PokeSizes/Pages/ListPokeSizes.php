<?php

namespace App\Filament\Resources\PokeSizes\Pages;

use App\Filament\Resources\PokeSizes\PokeSizeResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPokeSizes extends ListRecords
{
    protected static string $resource = PokeSizeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
