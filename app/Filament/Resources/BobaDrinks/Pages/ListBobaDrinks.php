<?php

namespace App\Filament\Resources\BobaDrinks\Pages;

use App\Filament\Resources\BobaDrinks\BobaDrinkResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListBobaDrinks extends ListRecords
{
    protected static string $resource = BobaDrinkResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
