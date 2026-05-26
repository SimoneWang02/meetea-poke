<?php

namespace App\Http\Controllers;

use App\Models\Bevanda;
use App\Models\BobaCategory;
use App\Models\BobaToppingGroup;
use App\Models\PokeIngredientGroup;
use App\Models\PokeSize;
use App\Models\Snack;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class MenuController extends Controller
{
    public const CACHE_KEY = 'public.menu';

    public function index(): JsonResponse
    {
        $menu = Cache::remember(self::CACHE_KEY, 300, function () {
            return [
                'poke' => $this->pokeMenu(),
                'boba' => $this->bobaMenu(),
                'snacks' => $this->snacksMenu(),
                'bevande' => $this->bevandeMenu(),
            ];
        });

        return response()->json($menu);
    }

    private function pokeMenu(): array
    {
        $sizes = PokeSize::query()->active()->ordered()->get()
            ->map(fn (PokeSize $s) => [
                'id' => $s->id,
                'slug' => $s->slug,
                'nome' => $s->nome,
                'prezzo' => (float) $s->prezzo,
                'max_proteine' => $s->max_proteine,
                'max_green' => $s->max_green,
                'max_crispy' => $s->max_crispy,
                'max_salse' => $s->max_salse,
            ])->values()->all();

        $groups = PokeIngredientGroup::query()
            ->with(['ingredients' => fn ($q) => $q->active()->ordered()])
            ->ordered()
            ->get()
            ->map(fn (PokeIngredientGroup $g) => [
                'id' => $g->id,
                'slug' => $g->slug,
                'nome' => $g->nome,
                'prezzo_extra' => (float) $g->prezzo_extra,
                'ingredients' => $g->ingredients->map(fn ($i) => [
                    'id' => $i->id,
                    'nome' => $i->nome,
                ])->values()->all(),
            ])->values()->all();

        return [
            'sizes' => $sizes,
            'groups' => $groups,
            'basi_max' => 2,
        ];
    }

    private function bobaMenu(): array
    {
        $categories = BobaCategory::query()
            ->active()
            ->ordered()
            ->with([
                'drinks' => fn ($q) => $q->active()->ordered()->with('sizes'),
            ])
            ->get()
            ->map(fn (BobaCategory $c) => [
                'id' => $c->id,
                'slug' => $c->slug,
                'nome' => $c->nome,
                'basi' => $c->basi ?? [],
                'drinks' => $c->drinks->map(fn ($d) => [
                    'id' => $d->id,
                    'slug' => $d->slug,
                    'nome' => $d->nome,
                    'ingredienti' => $d->ingredienti,
                    'image_path' => $d->image_path,
                    'sizes' => $d->sizes->mapWithKeys(fn ($s) => [
                        $s->size => (float) $s->prezzo,
                    ])->all(),
                ])->values()->all(),
            ])->values()->all();

        $toppingGroups = BobaToppingGroup::query()
            ->with(['toppings' => fn ($q) => $q->active()->ordered()])
            ->ordered()
            ->get()
            ->map(function (BobaToppingGroup $g) {
                $parents = $g->toppings->whereNull('parent_id');
                return [
                    'id' => $g->id,
                    'slug' => $g->slug,
                    'nome' => $g->nome,
                    'toppings' => $parents->map(function ($t) use ($g) {
                        $gusti = $g->toppings->where('parent_id', $t->id);
                        return [
                            'id' => $t->id,
                            'nome' => $t->nome,
                            'gusti' => $gusti->map(fn ($child) => [
                                'id' => $child->id,
                                'nome' => $child->nome,
                            ])->values()->all(),
                        ];
                    })->values()->all(),
                ];
            })->values()->all();

        return [
            'categories' => $categories,
            'topping_groups' => $toppingGroups,
        ];
    }

    private function snacksMenu(): array
    {
        return Snack::query()
            ->active()
            ->ordered()
            ->with([
                'variants' => fn ($q) => $q->orderBy('sort_order'),
                'flavors'  => fn ($q) => $q->where('active', true)->orderBy('sort_order'),
            ])
            ->get()
            ->map(fn (Snack $s) => [
                'id' => $s->id,
                'slug' => $s->slug,
                'nome' => $s->nome,
                'image_path' => $s->image_path,
                'variants' => $s->variants->map(fn ($v) => [
                    'id' => $v->id,
                    'qty' => $v->qty,
                    'prezzo' => (float) $v->prezzo,
                ])->values()->all(),
                'flavors' => $s->flavors->pluck('nome')->values()->all(),
            ])
            ->values()
            ->all();
    }

    private function bevandeMenu(): array
    {
        return Bevanda::query()
            ->active()
            ->ordered()
            ->get()
            ->map(fn (Bevanda $b) => [
                'id' => $b->id,
                'nome' => $b->nome,
                'prezzo' => (float) $b->prezzo,
                'image_path' => $b->image_path,
            ])
            ->values()
            ->all();
    }
}
