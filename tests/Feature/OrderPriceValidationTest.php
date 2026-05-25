<?php

namespace Tests\Feature;

use App\Models\Order;
use Database\Seeders\MenuSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class OrderPriceValidationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MenuSeeder::class);
        Carbon::setTestNow(Carbon::create(2026, 5, 26, 14, 0));
    }

    public function test_poke_base_price_matches_size(): void
    {
        $payload = $this->basePayload([
            [
                'tipo' => 'poke',
                'nome' => 'Poke Bowl Small',
                'prezzo_base' => 99.99,
                'quantita' => 1,
                'configurazione' => [
                    'dimensione' => 'small',
                    'basi' => ['Riso Sushi'],
                    'proteine' => ['Salmone'],
                    'green' => ['Avocado'],
                    'crispy' => ['Sesamo'],
                    'salse' => ['Salsa di Soia'],
                ],
            ],
        ]);

        $res = $this->postJson('/api/orders', $payload);
        $res->assertCreated();

        $order = Order::find($res->json('id'));
        $this->assertEquals('9.90', $order->totale);
    }

    public function test_poke_with_extras_includes_surcharge(): void
    {
        $payload = $this->basePayload([
            [
                'tipo' => 'poke',
                'quantita' => 1,
                'configurazione' => [
                    'dimensione' => 'small',
                    'extras' => [
                        'proteine' => [
                            ['nome' => 'Salmone', 'prezzo' => 1.8],
                            ['nome' => 'Tonno', 'prezzo' => 1.8],
                        ],
                        'salse' => [['nome' => 'Salsa Teriyaki', 'prezzo' => 1.3]],
                    ],
                ],
            ],
        ]);

        $res = $this->postJson('/api/orders', $payload);
        $res->assertCreated();

        $order = Order::find($res->json('id'));
        // small 9.90 + 2 proteine extra (2*1.80) + 1 salsa extra (1.30) = 14.80
        $this->assertEquals('14.80', $order->totale);
    }

    public function test_invalid_poke_size_returns_422(): void
    {
        $payload = $this->basePayload([
            [
                'tipo' => 'poke',
                'quantita' => 1,
                'configurazione' => ['dimensione' => 'inexistent'],
            ],
        ]);

        $this->postJson('/api/orders', $payload)
            ->assertStatus(422)
            ->assertJsonFragment(['message' => 'Dimensione poke non valida: inexistent']);
    }

    public function test_invalid_bubble_tea_returns_422(): void
    {
        $payload = $this->basePayload([
            [
                'tipo' => 'bubbletea',
                'quantita' => 1,
                'configurazione' => [
                    'nome' => 'Drink Inesistente',
                    'size' => 'G',
                ],
            ],
        ]);

        $this->postJson('/api/orders', $payload)->assertStatus(422);
    }

    private function basePayload(array $items): array
    {
        return [
            'nome_cliente' => 'Mario Rossi',
            'telefono' => '+39 333 1234567',
            'orario_ritiro' => Carbon::now()->addHour()->format('H:i'),
            'note' => null,
            'items' => $items,
        ];
    }
}
