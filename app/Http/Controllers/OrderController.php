<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function store(Request $request, NotificationService $notifier): JsonResponse
    {
        if (Carbon::today()->dayOfWeek === Carbon::THURSDAY) {
            return response()->json(
                ['message' => 'Ordinazioni non disponibili il giovedì.'],
                422
            );
        }

        $data = $request->validate([
            'nome_cliente' => ['required', 'string', 'max:100'],
            'telefono' => ['required', 'string', 'max:30'],
            'orario_ritiro' => ['required', 'string', 'regex:/^\d{2}:\d{2}$/'],
            'note' => ['nullable', 'string', 'max:500'],
            'totale' => ['nullable', 'numeric', 'min:0'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.tipo' => ['required', 'in:poke,bubbletea,sfizio'],
            'items.*.nome' => ['nullable', 'string', 'max:200'],
            'items.*.prezzo_base' => ['nullable', 'numeric', 'min:0'],
            'items.*.quantita' => ['required', 'integer', 'min:1', 'max:10'],
            'items.*.configurazione' => ['required', 'array'],
        ]);

        $data['items'] = array_map(function ($item) {
            if (!empty($item['nome']) && empty($item['configurazione']['nome'])) {
                $item['configurazione']['nome'] = $item['nome'];
            }
            if (isset($item['prezzo_base']) && !isset($item['configurazione']['prezzo_base'])) {
                $item['configurazione']['prezzo_base'] = $item['prezzo_base'];
            }
            return array_intersect_key($item, array_flip(['tipo', 'quantita', 'configurazione']));
        }, $data['items']);

        $orario = Carbon::today()->setTimeFromTimeString($data['orario_ritiro']);
        if ($orario->isPast()) {
            return response()->json(
                ['message' => 'Orario di ritiro non più disponibile.'],
                422
            );
        }

        try {
            $order = retry(3, function () use ($data) {
                return DB::transaction(function () use ($data) {
                    $progressivo = Order::whereDate('created_at', today())->count() + 1;
                    $numero = $progressivo;

                    $order = Order::create([
                        'numero_ordine' => $numero,
                        'nome_cliente' => $data['nome_cliente'],
                        'telefono' => $data['telefono'],
                        'orario_ritiro' => $data['orario_ritiro'],
                        'note' => $data['note'] ?? null,
                        'totale' => $data['totale'] ?? null,
                        'stato' => 'nuovo',
                    ]);

                    $order->items()->createMany($data['items']);

                    return $order->load('items');
                });
            }, 50, fn ($e) => $e instanceof \Illuminate\Database\UniqueConstraintViolationException);
        } catch (\Throwable $e) {
            Log::error('Creazione ordine fallita', ['message' => $e->getMessage()]);

            return response()->json(
                ['message' => 'Impossibile creare l\'ordine. Riprova fra poco.'],
                500
            );
        }

        try {
            $notifier->send($order);
        } catch (\Throwable $e) {
            Log::error('Notifica ordine fallita', [
                'order_id' => $order->id,
                'message' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'id' => $order->id,
            'numero_ordine' => $order->numero_ordine,
            'orario_ritiro' => $order->orario_ritiro,
            'nome_cliente' => $order->nome_cliente,
        ], 201);
    }

    public function index(): JsonResponse
    {
        $orders = Order::with('items')
            ->whereDate('created_at', today())
            ->orderBy('orario_ritiro')
            ->get();

        return response()->json($orders);
    }

    public function updateStato(Request $request, Order $order): JsonResponse
    {
        $data = $request->validate([
            'stato' => ['required', 'in:nuovo,in_preparazione,pronto'],
        ]);

        $order->update(['stato' => $data['stato']]);

        return response()->json($order->load('items'));
    }

    public function printQueue(): JsonResponse
    {
        $orders = Order::with('items')
            ->where('stampato', false)
            ->whereDate('created_at', today())
            ->orderBy('created_at')
            ->get()
            ->map(fn (Order $o) => [
                'id'            => $o->id,
                'numero_ordine' => $o->numero_ordine,
                'nome_cliente'  => $o->nome_cliente,
                'orario_ritiro' => $o->orario_ritiro,
                'note'          => $o->note,
                'totale'        => $o->totale,
                'telefono'      => $o->telefono,
                'items'         => $o->items->map(fn ($item) => [
                    'tipo'           => $item->tipo,
                    'quantita'       => $item->quantita,
                    'configurazione' => $item->configurazione,
                ]),
            ]);

        return response()->json($orders);
    }

    public function markStampato(Order $order): JsonResponse
    {
        $order->update(['stampato' => true]);

        return response()->json(['ok' => true]);
    }
}
