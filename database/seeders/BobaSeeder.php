<?php

namespace Database\Seeders;

use App\Models\BobaCategory;
use App\Models\BobaDrink;
use App\Models\BobaDrinkSize;
use App\Models\BobaTopping;
use App\Models\BobaToppingGroup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BobaSeeder extends Seeder
{
    public function run(): void
    {
        $categorie = [
            [
                'slug' => 'te-latte',
                'nome' => 'Tè al Latte',
                'items' => [
                    ['Bubble Tea Nero',                4, 5],
                    ['Bubble Tea Verde',               4, 5],
                    ['Bubble Tea con Cappuccino',      4, 5],
                    ['Bubble Tea al Taro',             4, 5],
                    ['Bubble Tea con Caramel',         4, 5],
                    ['Bubble Tea ai Fagioli Rossi',    4, 5],
                    ['Bubble Tea al Cioccolato',       4, 5],
                    ['Latte al Cocco',                 4.5, 5.5],
                    ['Latte di Cocco con Mango',       4.5, 5.5],
                    ['Latte di Cocco con Taro',        4.5, 5.5],
                    ['Latte di Cocco con Grano',       4.5, 5.5],
                    ['Bubble Tea Matcha',              4.5, 5.5],
                    ['Zucchero Tostato',               4.5, 5.5],
                ],
            ],
            [
                'slug' => 'te-latte-frutta',
                'nome' => 'Tè al Latte con Aroma Frutta',
                'items' => array_map(fn ($n) => [$n, 4, 5], [
                    'Bubble Tea alla Fragola', 'Bubble Tea al Mango', 'Bubble Tea alla Vaniglia',
                    'Bubble Tea alla Banana', 'Bubble Tea alla Papaya', 'Bubble Tea ai Litchi',
                    "Bubble Tea all'Anguria", 'Bubble Tea al Mirtillo', 'Bubble Tea al Melone',
                    'Bubble Tea alla Pesca',
                ]),
            ],
            [
                'slug' => 'te-verde-nero-granita',
                'nome' => 'Tè Verde, Nero o Granita',
                'basi' => ['Granita', 'Tè Verde Normale', 'Tè Verde Frizzante', 'Tè Nero Normale', 'Tè Nero Frizzante'],
                'items' => array_map(fn ($n) => [$n, 4, 5], [
                    'Mango', 'Fragola', 'Ananas', 'Anguria', 'Mela Verde', 'Melone', 'Red Guava', 'Menta',
                    'Mirtillo', 'Kiwi', 'Miele', 'Pesca', 'Zenzero', 'Uva', 'Ciliegia', 'Litchi', 'Limone',
                    'Maracuja', 'Cocco', 'Lampone', 'Arancia', 'Pompelmo', 'Banana', 'Papaya',
                ]),
            ],
            [
                'slug' => 'speciali-senza-latte',
                'nome' => 'Bubble Tea Speciali (Senza Latte)',
                'items' => [
                    ['Tè Limone alla Fragola',           null, 5.5, 'Tè verde, fette di limone, fragola fresca', 'te_limone_fragola.PNG'],
                    ['Tè Limone con Pesca',              null, 5.5, 'Tè verde, aroma di pesca, pesca e limone freschi', 'te_limone_pesca.PNG'],
                    ["Passion Fruit all'Ananas",         null, 5.5, 'Tè verde, passion fruit e ananas freschi', 'passion_fruit_ananas.PNG'],
                    ['Passion Fruit al Mango',           null, 5.5, 'Tè verde, passion fruit e mango freschi', 'passion_fruit_mango.PNG'],
                    ["Tè all'Arancia Fresca con Maracuja", null, 5.5],
                ],
            ],
            [
                'slug' => 'speciali-con-latte',
                'nome' => 'Bubble Tea Speciali (Con Latte)',
                'items' => [
                    ['Latte di Cocco con Matcha',          null, 5.5, 'Latte di cocco, matcha', 'latte_cocco_matcha.PNG'],
                    ['Oreo',                                null, 5.5, 'Tè nero, latte, biscotti Oreo, panna montata', 'oreo.PNG'],
                    ['Tè Sporco Originale',                 null, 5,   'Tè verde, latte, zucchero di canna', 'te_sporco_originale.PNG'],
                    ['Fragola Tricolore',                   null, 5.5, 'Marmellata di fragole, latte, fiore blu', 'fragola_tricolore.PNG'],
                    ['Matcha e Fragola con Latte',          null, 6,   'Latte, fragole, panna montata al matcha', 'matcha_fragola_latte.PNG'],
                    ['Tè Sporco alla Patata Dolce',         null, 5.5, 'Marmellata di patata dolce, latte'],
                    ['Tè Sporco al Matcha',                 null, 5.5, 'Marmellata di matcha, latte'],
                    ['Latte di Cocco Denso con Caffè',      null, 5.5, 'Latte di cocco, caffè', 'latte_cocco_denso_caffe.PNG'],
                    ['Tè Sporco al Mango',                  null, 5.5, 'Marmellata di mango con pezzetti, latte'],
                    ['Tè Sporco alla Fragola',              null, 5.5, 'Marmellata di fragola con pezzetti, latte'],
                    ['Latte di Cocco Denso al Mango',       null, 5.5, null, 'latte_cocco_denso_mango.PNG'],
                    ['I Miss You',                          null, 5.5, 'Latte probiotico gusto tropical con panna montata', 'i_miss_you.PNG'],
                    ['Yakult alla Fragola',                 null, 5.5, 'Latte probiotico, fragola fresca', 'yakult_fragola.PNG'],
                    ["Yakult all'Ananas",                   null, 5.5, 'Latte probiotico, ananas fresca', 'yakult_ananas.PNG'],
                    ["Yakult all'Arancia",                  null, 5.5, 'Latte probiotico, arancia fresca', 'yakult_arancia.PNG'],
                ],
            ],
            [
                'slug' => 'speciali-granite',
                'nome' => 'Bubble Tea Speciali (Granite)',
                'items' => [
                    ['Cheese Fragola',          null, 5.5, 'Granita alla fragola, frutta secca, panna montata', 'cheese_fragola.PNG'],
                    ['Cheese Uva',              null, 5.5, "Granita all'uva, frutta secca, panna montata", 'cheese_uva.PNG'],
                    ['Ananas Fresca in Granita', null, 5.5, "Granita all'ananas, frutta secca", 'ananas_fresca_granita.PNG'],
                    ['Cheese Dragon',           null, 5.5, null, 'cheese_dragon.PNG'],
                    ['Cheese Mango',            null, 5.5, null, 'cheese_mango.PNG'],
                ],
            ],
        ];

        foreach ($categorie as $catIdx => $cat) {
            $category = BobaCategory::updateOrCreate(
                ['slug' => $cat['slug']],
                ['nome' => $cat['nome'], 'sort_order' => $catIdx, 'active' => true, 'basi' => $cat['basi'] ?? null],
            );

            foreach ($cat['items'] as $drinkIdx => $tuple) {
                [$nome, $prezzoM, $prezzoG] = [$tuple[0], $tuple[1], $tuple[2]];
                $ingredienti = $tuple[3] ?? null;
                $image       = $tuple[4] ?? null;

                $drink = BobaDrink::updateOrCreate(
                    ['category_id' => $category->id, 'slug' => Str::slug($nome)],
                    [
                        'nome' => $nome,
                        'ingredienti' => $ingredienti,
                        'image_path' => $image ? 'menu/boba/'.$image : null,
                        'sort_order' => $drinkIdx,
                        'active' => true,
                    ],
                );

                if (!is_null($prezzoM)) {
                    BobaDrinkSize::updateOrCreate(
                        ['drink_id' => $drink->id, 'size' => 'M'],
                        ['prezzo' => $prezzoM],
                    );
                }
                if (!is_null($prezzoG)) {
                    BobaDrinkSize::updateOrCreate(
                        ['drink_id' => $drink->id, 'size' => 'G'],
                        ['prezzo' => $prezzoG],
                    );
                }
            }
        }

        $toppingsGroups = [
            'singoli' => [
                'Perle di Tapioca',
                'Jelly Erba',
                'Granella di Oreo',
            ],
            'gelatine' => ['Miste', 'Mela', 'Litchi', 'Cocco', 'Fragola'],
            'palline' => ['Limone', 'Litchi', 'Ciliegia', 'Lampone', 'Maracuja', 'Ananas', 'Fragola', 'Uva', 'Pesca', 'Mirtillo', 'Mela', 'Melograno', 'Mango'],
        ];

        $groupSingoli = BobaToppingGroup::updateOrCreate(['slug' => 'singoli'], ['nome' => 'Singoli', 'sort_order' => 0]);
        foreach ($toppingsGroups['singoli'] as $i => $nome) {
            BobaTopping::updateOrCreate(
                ['group_id' => $groupSingoli->id, 'parent_id' => null, 'nome' => $nome],
                ['sort_order' => $i, 'active' => true],
            );
        }

        $groupGelatine = BobaToppingGroup::updateOrCreate(['slug' => 'gelatine'], ['nome' => 'Gelatine', 'sort_order' => 1]);
        $parentGelatine = BobaTopping::updateOrCreate(
            ['group_id' => $groupGelatine->id, 'parent_id' => null, 'nome' => 'Gelatine'],
            ['sort_order' => 0, 'active' => true],
        );
        foreach ($toppingsGroups['gelatine'] as $i => $gusto) {
            BobaTopping::updateOrCreate(
                ['group_id' => $groupGelatine->id, 'parent_id' => $parentGelatine->id, 'nome' => $gusto],
                ['sort_order' => $i, 'active' => true],
            );
        }

        $groupPalline = BobaToppingGroup::updateOrCreate(['slug' => 'palline'], ['nome' => 'Palline', 'sort_order' => 2]);
        $parentPalline = BobaTopping::updateOrCreate(
            ['group_id' => $groupPalline->id, 'parent_id' => null, 'nome' => 'Palline'],
            ['sort_order' => 0, 'active' => true],
        );
        foreach ($toppingsGroups['palline'] as $i => $gusto) {
            BobaTopping::updateOrCreate(
                ['group_id' => $groupPalline->id, 'parent_id' => $parentPalline->id, 'nome' => $gusto],
                ['sort_order' => $i, 'active' => true],
            );
        }
    }
}
