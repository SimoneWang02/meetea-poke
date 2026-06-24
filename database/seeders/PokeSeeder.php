<?php

namespace Database\Seeders;

use App\Models\PokeIngredient;
use App\Models\PokeIngredientGroup;
use App\Models\PokeSize;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PokeSeeder extends Seeder
{
    public function run(): void
    {
        $sizes = [
            ['slug' => 'small',   'nome' => 'Small',   'prezzo' => 9.9,  'max_proteine' => 1, 'max_green' => 3, 'max_crispy' => 1, 'max_salse' => 1],
            ['slug' => 'regular', 'nome' => 'Regular', 'prezzo' => 11.9, 'max_proteine' => 2, 'max_green' => 4, 'max_crispy' => 2, 'max_salse' => 2],
            ['slug' => 'large',   'nome' => 'Large',   'prezzo' => 13.9, 'max_proteine' => 3, 'max_green' => 5, 'max_crispy' => 3, 'max_salse' => 3],
        ];
        foreach ($sizes as $i => $row) {
            PokeSize::updateOrCreate(
                ['slug' => $row['slug']],
                array_merge($row, ['sort_order' => $i, 'active' => true]),
            );
        }

        $groups = [
            ['slug' => 'basi',     'nome' => 'Basi',     'prezzo_extra' => 0],
            ['slug' => 'proteine', 'nome' => 'Proteine', 'prezzo_extra' => 1.8],
            ['slug' => 'green',    'nome' => 'Green',    'prezzo_extra' => 1.2],
            ['slug' => 'crispy',   'nome' => 'Crispy',   'prezzo_extra' => 0.3],
            ['slug' => 'salse',    'nome' => 'Salse',    'prezzo_extra' => 0.3],
        ];
        $groupIds = [];
        foreach ($groups as $i => $row) {
            $g = PokeIngredientGroup::updateOrCreate(
                ['slug' => $row['slug']],
                array_merge($row, ['sort_order' => $i]),
            );
            $groupIds[$row['slug']] = $g->id;
        }

        $ingredients = [
            'basi' => [
                'Riso Sushi', 'Riso Bianco', 'Riso Integrale', 'Riso Venere', 'Quinoa', 'Insalata',
            ],
            'proteine' => [
                'Salmone', 'Tonno', 'Salmone Marinato Spicy', 'Salmone Cotto', "Tonno Cotto sott'Olio",
                'Pollo Impanato', 'Tacchino', 'Uova Sodo', 'Tofu', 'Polipo Cotto', 'Gambero Cotto', 'Gambero in Tempura',
            ],
            'green' => [
                'Avocado', 'Edamame', 'Goma Wakame', 'Zucchine', 'Cetrioli', 'Carote', 'Pomodorini', 'Ceci', 'Mais', 'Ananas',
                'Mango', 'Cavolo Viola', 'Cipolla Rossa', 'Germogli di Soia', 'Zenzero Marinato', 'Jalapenos',
                'Fagioli Rossi', 'Olive', 'Feta Greca', 'Mozzarella', 'Philadelphia',
            ],
            'crispy' => [
                'Alga Nori', 'Cipolla Fritta', 'Sesamo', 'Semi di Girasole', 'Noci', 'Arachidi', 'Mandorle a Scaglie',
                'Granella di Pistacchio', 'Chips di Kataifi', 'Nachos', 'Arachidi al Wasabi', 'Parmigiano',
            ],
            'salse' => [
                'Salsa di Soia', 'Salsa di Soia senza Glutine', 'Salsa Teriyaki', 'Salsa Poke', 'Salsa Sweet Chili',
                'Salsa Ponzu', 'Olio Evo', 'Guacamole', 'Mayo Kewpie', 'Maionese', 'Maionese Vegana',
                'Salsa Yogurt', 'Spicy Maionese', 'Glassa di Aceto Balsamico',
            ],
        ];

        foreach ($ingredients as $groupSlug => $items) {
            foreach ($items as $i => $nome) {
                PokeIngredient::updateOrCreate(
                    ['group_id' => $groupIds[$groupSlug], 'slug' => Str::slug($nome)],
                    [
                        'nome' => $nome,
                        'sort_order' => $i,
                        'active' => true,
                    ],
                );
            }
        }
    }
}
