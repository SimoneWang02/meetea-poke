<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Http;

class NotificationService
{
    public function send(Order $order): void
    {
        $this->sendWhatsappCallmebot($order);

        // Punto di estensione: in futuro si potrà aggiungere qui la stampa
        // CloudPRNT verso la stampante Star Micronics mC-Print3 senza
        // toccare il flusso di creazione ordine.
        // $this->sendCloudPrnt($order);
    }

    public function sendWhatsappCallmebot(Order $order): void
    {
        $number = (string) config('services.whatsapp.number');
        $apikey = (string) config('services.whatsapp.apikey');

        if ($number === '' || $apikey === '') {
            return;
        }

        Http::timeout(8)->get('https://api.callmebot.com/whatsapp.php', [
            'phone' => $number,
            'text' => $this->formatMessage($order),
            'apikey' => $apikey,
        ]);
    }

    private function formatMessage(Order $order): string
    {
        $lines = [];
        $lines[] = "🆕 Nuovo ordine #{$order->numero_ordine}";
        $lines[] = "👤 {$order->nome_cliente}";
        $lines[] = "📞 {$order->telefono}";
        $lines[] = "🕐 Ritiro alle {$order->orario_ritiro}";
        $lines[] = '';

        foreach ($order->items as $item) {
            $lines[] = $this->formatItem($item);
            $lines[] = '';
        }

        if (! empty($order->note)) {
            $lines[] = "📝 Note: {$order->note}";
        }

        return trim(implode("\n", $lines));
    }

    private function formatItem(OrderItem $item): string
    {
        $cfg = $item->configurazione ?? [];
        $qta = $item->quantita;

        if ($item->tipo === 'poke') {
            $lines = ["🥗 Poke Bowl x{$qta}"];
            $lines[] = '• Base: ' . ($cfg['base'] ?? '-');
            $lines[] = '• Proteina: ' . ($cfg['proteina'] ?? '-');
            $toppings = $cfg['topping'] ?? [];
            $lines[] = '• Topping: ' . (count($toppings) ? implode(', ', $toppings) : '-');
            $lines[] = '• Salsa: ' . ($cfg['salsa'] ?? '-');

            return implode("\n", $lines);
        }

        $lines = ["🧋 Bubble Tea x{$qta}"];
        $lines[] = '• Tea: ' . ($cfg['tea'] ?? '-');
        $lines[] = '• Latte: ' . ($cfg['latte'] ?? '-');
        $lines[] = '• Pearls: ' . ($cfg['pearls'] ?? '-');
        $lines[] = '• Dolcezza: ' . ($cfg['dolcezza'] ?? '-');
        $lines[] = '• Ghiaccio: ' . ($cfg['ghiaccio'] ?? '-');

        return implode("\n", $lines);
    }
}
