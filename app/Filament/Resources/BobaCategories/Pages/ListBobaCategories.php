<?php

namespace App\Filament\Resources\BobaCategories\Pages;

use App\Filament\Resources\BobaCategories\BobaCategoryResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListBobaCategories extends ListRecords
{
    protected static string $resource = BobaCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
