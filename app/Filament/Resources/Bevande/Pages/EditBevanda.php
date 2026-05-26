<?php

namespace App\Filament\Resources\Bevande\Pages;

use App\Filament\Resources\Bevande\BevandaResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditBevanda extends EditRecord
{
    protected static string $resource = BevandaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
