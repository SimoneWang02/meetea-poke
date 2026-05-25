<?php

namespace App\Filament\Resources\PokeIngredientGroups\Pages;

use App\Filament\Resources\PokeIngredientGroups\PokeIngredientGroupResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPokeIngredientGroups extends ListRecords
{
    protected static string $resource = PokeIngredientGroupResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
