<?php

namespace Database\Seeders;

use App\Models\TeaOption;
use Illuminate\Database\Seeder;

class TeaOptionsSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'basi'     => ['tè nero', 'tè verde', 'taro', 'matcha'],
            'latte'    => ['con latte', 'senza latte'],
            'pearls'   => ['tapioca classica', 'popping boba fragola', 'nessuna'],
            'dolcezza' => ['0%', '25%', '50%', '75%', '100%'],
            'ghiaccio' => ['no ghiaccio', 'poco', 'normale', 'tanto'],
        ];

        foreach ($data as $gruppo => $items) {
            foreach ($items as $i => $nome) {
                TeaOption::updateOrCreate(
                    ['gruppo' => $gruppo, 'nome' => $nome],
                    ['sort_order' => $i, 'active' => true],
                );
            }
        }
    }
}
