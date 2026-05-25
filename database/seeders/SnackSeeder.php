<?php

namespace Database\Seeders;

use App\Models\Snack;
use App\Models\SnackVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SnackSeeder extends Seeder
{
    public function run(): void
    {
        $snacks = [
            ['Ravioli di Carne',           'ravioli_carne.JPG',     [['6pz', 4]]],
            ['Ravioli di Gamberi',         'ravioli_gamberi.JPG',   [['4pz', 5]]],
            ['Pollo Riempito con Riso',    'pollo_riempito.JPG',    [['1pz', 4.5]]],
            ['Panino Maialino',            'panino_maialino.JPG',   [['4pz', 5]]],
            ['Popcorn Chicken',            'popcorn_chicken.JPG',   [['1 Porzione', 3.5]]],
            ['Strisce di Pollo',           'strisce_pollo.JPG',     [['1 Porzione', 3.5]]],
            ['Pollo Fritto',               null,                    [['4pz', 5]]],
            ['Hot Dog',                    'hot_dog.JPG',           [['1 Porzione', 2]]],
            ['Takoyaki',                   'takoyaki.JPG',          [['4pz', 4], ['6pz', 5.5]]],
            ['Cheese Panino',              null,                    [['1pz', 4.5]]],
            ['Gambero Tempura',            'tempura_gamberi.JPG',   [['4pz', 5]]],
            ['Dorayaki',                   'dorayaki.JPG',          [['1pz', 2]]],
            ['Mochi',                      'mochi.JPG',             [['1pz', 2], ['2pz', 4.5], ['3pz', 6]]],
        ];

        foreach ($snacks as $i => [$nome, $image, $variants]) {
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
        }
    }
}
