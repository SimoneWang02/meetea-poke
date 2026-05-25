<?php

namespace App\Filament\Resources\BobaDrinks\Pages;

use App\Filament\Resources\BobaDrinks\BobaDrinkResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditBobaDrink extends EditRecord
{
    protected static string $resource = BobaDrinkResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
