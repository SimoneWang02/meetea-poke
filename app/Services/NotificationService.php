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
            $join = fn (array $xs) => count($xs) ? implode(', ', $xs) : '-';
            $lines = ["🥗 Poke Bowl x{$qta}"];
            $lines[] = '• Dimensione: ' . ($cfg['dimensione'] ?? '-');
            $lines[] = '• Basi: ' . $join($cfg['basi'] ?? []);
            $lines[] = '• Proteine: ' . $join($cfg['proteine'] ?? []);
            $lines[] = '• Green: ' . $join($cfg['green'] ?? []);
            $lines[] = '• Crispy: ' . $join($cfg['crispy'] ?? []);
            $lines[] = '• Salse: ' . $join($cfg['salse'] ?? []);

            return implode("\n", $lines);
        }

        if ($item->tipo === 'bubbletea') {
            $lines = ["🧋 Bubble Tea x{$qta}"];
            $lines[] = '• Nome: ' . ($cfg['nome'] ?? '-');
            $lines[] = '• Size: ' . ($cfg['size'] ?? '-');
            $lines[] = '• Temperatura: ' . ($cfg['temperatura'] ?? '-');
            $toppings = array_map(
                fn ($t) => isset($t['gusto']) ? "{$t['nome']} ({$t['gusto']})" : $t['nome'],
                $cfg['toppings'] ?? []
            );
            $lines[] = '• Toppings: ' . (count($toppings) ? implode(', ', $toppings) : '-');

            return implode("\n", $lines);
        }

        if ($item->tipo === 'sfizio') {
            $lines = ["🥟 Sfizio x{$qta}"];
            $lines[] = '• Nome: ' . ($cfg['nome'] ?? '-');
            $lines[] = '• Porzione: ' . ($cfg['porzione'] ?? '-');

            return implode("\n", $lines);
        }

        if ($item->tipo === 'bevande') {
            $lines = ["🥤 Bevanda x{$qta}"];
            $lines[] = '• Nome: ' . ($cfg['nome'] ?? '-');

            return implode("\n", $lines);
        }

        return "❓ {$item->tipo} x{$qta}";
    }
}
