<?php

namespace App\Filament\Resources\BobaToppingGroups\Pages;

use App\Filament\Resources\BobaToppingGroups\BobaToppingGroupResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListBobaToppingGroups extends ListRecords
{
    protected static string $resource = BobaToppingGroupResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
