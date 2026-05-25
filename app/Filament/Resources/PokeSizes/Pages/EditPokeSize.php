<?php

namespace App\Filament\Resources\PokeSizes\Pages;

use App\Filament\Resources\PokeSizes\PokeSizeResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditPokeSize extends EditRecord
{
    protected static string $resource = PokeSizeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
