<?php

namespace App\Filament\Resources\Snacks\Pages;

use App\Filament\Resources\Snacks\SnackResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSnack extends EditRecord
{
    protected static string $resource = SnackResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
