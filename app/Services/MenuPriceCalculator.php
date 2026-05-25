<?php

namespace App\Services;

use App\Exceptions\InvalidConfigurationException;
use App\Models\BobaCategory;
use App\Models\BobaDrink;
use App\Models\BobaTopping;
use App\Models\PokeIngredientGroup;
use App\Models\PokeSize;
use App\Models\Snack;
use App\Models\SnackVariant;

class MenuPriceCalculator
{
    private const TOPPING_INCLUSO = 0.50;

    public function calculate(string $tipo, array $configurazione): float
    {
        return match ($tipo) {
            'poke' => $this->calculatePoke($configurazione),
            'bubbletea' => $this->calculateBubbleTea($configurazione),
            'sfizio' => $this->calculateSfizio($configurazione),
            default => throw new InvalidConfigurationException("Tipo prodotto sconosciuto: {$tipo}"),
        };
    }

    private function calculatePoke(array $cfg): float
    {
        $sizeSlug = $cfg['dimensione'] ?? null;
        $size = PokeSize::query()->where('slug', $sizeSlug)->where('active', true)->first();
        if (!$size) {
            throw new InvalidConfigurationException("Dimensione poke non valida: {$sizeSlug}");
        }

        $totale = (float) $size->prezzo;

        $extras = $cfg['extras'] ?? [];
        foreach (['proteine', 'green', 'crispy', 'salse'] as $groupSlug) {
            $group = PokeIngredientGroup::query()->where('slug', $groupSlug)->first();
            if (!$group) {
                continue;
            }
            $extraCount = count($extras[$groupSlug] ?? []);
            if ($extraCount > 0) {
                $totale += $extraCount * (float) $group->prezzo_extra;
            }
        }

        return round($totale, 2);
    }

    private function calculateBubbleTea(array $cfg): float
    {
        $nome = $cfg['nome'] ?? null;
        $sizeChoice = $cfg['size'] ?? null;
        if (!$nome || !$sizeChoice) {
            throw new InvalidConfigurationException('Bubble tea: nome e size obbligatori.');
        }

        $drink = BobaDrink::query()
            ->where('nome', $nome)
            ->where('active', true)
            ->with('sizes')
            ->first();
        if (!$drink) {
            throw new InvalidConfigurationException("Bubble tea non trovato: {$nome}");
        }

        $size = $drink->sizes->firstWhere('size', $sizeChoice);
        if (!$size) {
            throw new InvalidConfigurationException("Bubble tea {$nome}: formato {$sizeChoice} non disponibile.");
        }

        $totale = (float) $size->prezzo;

        $toppings = $cfg['toppings'] ?? [];
        $toppingsCost = 0.0;
        foreach ($toppings as $t) {
            $toppingNome = $t['nome'] ?? null;
            $gusto = $t['gusto'] ?? null;
            if (!$toppingNome) {
                continue;
            }

            $topping = BobaTopping::query()
                ->where('nome', $toppingNome)
                ->whereNull('parent_id')
                ->where('active', true)
                ->first();

            if (!$topping) {
                throw new InvalidConfigurationException("Topping non valido: {$toppingNome}");
            }

            if ($gusto) {
                $child = BobaTopping::query()
                    ->where('parent_id', $topping->id)
                    ->where('nome', $gusto)
                    ->where('active', true)
                    ->first();
                if (!$child) {
                    throw new InvalidConfigurationException("Gusto {$gusto} non disponibile per {$toppingNome}.");
                }
            }

            $toppingsCost += (float) $topping->prezzo;
        }

        $toppingsCost = max(0.0, $toppingsCost - self::TOPPING_INCLUSO);

        return round($totale + $toppingsCost, 2);
    }

    private function calculateSfizio(array $cfg): float
    {
        $nome = $cfg['nome'] ?? null;
        $porzione = $cfg['porzione'] ?? null;
        if (!$nome || !$porzione) {
            throw new InvalidConfigurationException('Sfizio: nome e porzione obbligatori.');
        }

        $snack = Snack::query()->where('nome', $nome)->where('active', true)->first();
        if (!$snack) {
            throw new InvalidConfigurationException("Snack non trovato: {$nome}");
        }

        $variant = SnackVariant::query()
            ->where('snack_id', $snack->id)
            ->where('qty', $porzione)
            ->first();
        if (!$variant) {
            throw new InvalidConfigurationException("Snack {$nome}: porzione {$porzione} non disponibile.");
        }

        return round((float) $variant->prezzo, 2);
    }
}
