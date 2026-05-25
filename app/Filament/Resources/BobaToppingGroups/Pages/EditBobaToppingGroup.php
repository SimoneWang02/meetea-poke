<?php

namespace App\Filament\Resources\BobaToppingGroups\Pages;

use App\Filament\Resources\BobaToppingGroups\BobaToppingGroupResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditBobaToppingGroup extends EditRecord
{
    protected static string $resource = BobaToppingGroupResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
