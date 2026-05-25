<?php

namespace App\Filament\Resources\PokeIngredientGroups\Pages;

use App\Filament\Resources\PokeIngredientGroups\PokeIngredientGroupResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditPokeIngredientGroup extends EditRecord
{
    protected static string $resource = PokeIngredientGroupResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
