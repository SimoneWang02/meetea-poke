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
            'items' => ['required', 'array', 'min:1'],
            'items.*.tipo' => ['required', 'in:poke,bubbletea'],
            'items.*.quantita' => ['required', 'integer', 'min:1', 'max:10'],
            'items.*.configurazione' => ['required', 'array'],
        ]);

        $order = DB::transaction(function () use ($data) {
            $progressivo = Order::whereDate('created_at', today())->count() + 1;
            $numero = 'ORD-' . str_pad((string) $progressivo, 3, '0', STR_PAD_LEFT);

            $order = Order::create([
                'numero_ordine' => $numero,
                'nome_cliente' => $data['nome_cliente'],
                'telefono' => $data['telefono'],
                'orario_ritiro' => $data['orario_ritiro'],
                'note' => $data['note'] ?? null,
                'stato' => 'nuovo',
            ]);

            $order->items()->createMany($data['items']);

            return $order->load('items');
        });

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
}
