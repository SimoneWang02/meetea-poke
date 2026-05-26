<?php

namespace Database\Seeders;

use App\Models\Snack;
use App\Models\SnackFlavor;
use App\Models\SnackVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SnackSeeder extends Seeder
{
    public function run(): void
    {
        $snacks = [
            ['Ravioli di Carne',  'ravioli_carne.JPG',  [['6pz', 4]],            []],
            ['Ravioli di Gamberi','ravioli_gamberi.JPG', [['4pz', 5]],            []],
            ['Mochi',             'mochi.JPG',           [['1pz', 2], ['2pz', 4.5], ['3pz', 6]],
                ['Cocco', 'Matcha', 'Mango', 'Fragola', 'Pistacchio', 'Cioccolato e Nocciola']],
        ];

        foreach ($snacks as $i => [$nome, $image, $variants, $flavors]) {
            $snack = Snack::updateOrCreate(
                ['slug' => Str::slug($nome)],
                [
                    'nome' => $nome,
                    'image_path' => $image ? 'menu/snacks/'.$image : null,
                    'sort_order' => $i,
                    'active' => true,
                ],
            );

            foreach ($variants as $vi => [$qty, $prezzo]) {
                SnackVariant::updateOrCreate(
                    ['snack_id' => $snack->id, 'qty' => $qty],
                    ['prezzo' => $prezzo, 'sort_order' => $vi],
                );
            }

            foreach ($flavors as $fi => $flavorNome) {
                SnackFlavor::updateOrCreate(
                    ['snack_id' => $snack->id, 'nome' => $flavorNome],
                    ['sort_order' => $fi, 'active' => true],
                );
            }
        }
    }
}
