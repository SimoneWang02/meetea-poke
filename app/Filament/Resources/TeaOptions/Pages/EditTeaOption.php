<?php

namespace App\Filament\Resources\TeaOptions\Pages;

use App\Filament\Resources\TeaOptions\TeaOptionResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditTeaOption extends EditRecord
{
    protected static string $resource = TeaOptionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
