<?php

namespace App\Filament\Resources\BobaCategories\Pages;

use App\Filament\Resources\BobaCategories\BobaCategoryResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditBobaCategory extends EditRecord
{
    protected static string $resource = BobaCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
