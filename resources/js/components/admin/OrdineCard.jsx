import React from 'react';

function Divider() {
    return <div className="border-t border-dashed border-stone-300 my-2" />;
}

function PokeItem({ cfg, quantita }) {
    const titolo = cfg.dimensione
        ? cfg.dimensione.charAt(0).toUpperCase() + cfg.dimensione.slice(1)
        : 'Poke Bowl';
    const prezzo = cfg.prezzo_base != null
        ? (cfg.prezzo_base * quantita).toFixed(2)
        : null;

    const righe = [
        ...(cfg.basi || []).map((v) => ({ sym: '+', val: v })),
        ...(cfg.proteine || []).map((v) => ({ sym: '+', val: v })),
        ...(cfg.green || []).map((v) => ({ sym: '+', val: v })),
        ...(cfg.crispy || []).map((v) => ({ sym: '+', val: v })),
        ...(cfg.salse || []).map((v) => ({ sym: '+', val: v })),
        ...Object.values(cfg.extras || {}).flat().map((e) => ({ sym: '++', val: e.nome || e })),
        ...(cfg.salsa_a_parte ? [{ sym: '-', val: 'Salsa a parte' }] : []),
        ...(cfg.posate && cfg.posate !== 'Senza Posate' ? [{ sym: '-', val: cfg.posate }] : []),
    ];

    return (
        <div>
            <div className="flex justify-between font-bold text-sm">
                <span>{quantita}x {titolo}</span>
                {prezzo && <span>{prezzo}</span>}
            </div>
            {righe.map((r, i) => (
                <div key={i} className="text-xs text-stone-600 pl-3">
                    {r.sym} {r.val}
                </div>
            ))}
        </div>
    );
}

function BubbleteaItem({ cfg, quantita }) {
    const titolo = cfg.nome || 'Bubble Tea';
    const prezzo = cfg.prezzo_base != null
        ? (cfg.prezzo_base * quantita).toFixed(2)
        : null;

    const size = cfg.size === 'M' ? 'Media' : cfg.size === 'G' ? 'Grande' : cfg.size;
    const temp = cfg.temperatura
        ? cfg.temperatura.charAt(0).toUpperCase() + cfg.temperatura.slice(1)
        : null;

    const toppings = (cfg.toppings || []).map((t) =>
        t.gusto ? `${t.nome} (${t.gusto})` : t.nome
    );

    return (
        <div>
            <div className="flex justify-between font-bold text-sm">
                <span>{quantita}x {titolo}</span>
                {prezzo && <span>{prezzo}</span>}
            </div>
            {size && <div className="text-xs text-stone-600 pl-3">- {size}</div>}
            {temp && <div className="text-xs text-stone-600 pl-3">- {temp}</div>}
            {toppings.map((t, i) => (
                <div key={i} className="text-xs text-stone-600 pl-3">+ {t}</div>
            ))}
        </div>
    );
}

function AltroItem({ cfg, quantita, tipo }) {
    const titolo = cfg.nome || tipo.charAt(0).toUpperCase() + tipo.slice(1);
    const prezzo = cfg.prezzo_base != null
        ? (cfg.prezzo_base * quantita).toFixed(2)
        : null;

    return (
        <div>
            <div className="flex justify-between font-bold text-sm">
                <span>{quantita}x {titolo}</span>
                {prezzo && <span>{prezzo}</span>}
            </div>
            {cfg.porzione && (
                <div className="text-xs text-stone-600 pl-3">{cfg.porzione}</div>
            )}
        </div>
    );
}

function ItemDettaglio({ item }) {
    const cfg = item.configurazione || {};
    if (item.tipo === 'poke') return <PokeItem cfg={cfg} quantita={item.quantita} />;
    if (item.tipo === 'bubbletea') return <BubbleteaItem cfg={cfg} quantita={item.quantita} />;
    return <AltroItem cfg={cfg} quantita={item.quantita} tipo={item.tipo} />;
}

const TIPO_ORDER = { poke: 0, bubbletea: 1 };

export default function OrdineCard({ order }) {
    const sortedItems = [...(order.items || [])].sort(
        (a, b) => (TIPO_ORDER[a.tipo] ?? 2) - (TIPO_ORDER[b.tipo] ?? 2)
    );

    const totale = order.totale != null
        ? parseFloat(order.totale)
        : sortedItems.reduce(
            (sum, it) => sum + it.quantita * (it.configurazione?.prezzo_base ?? 0),
            0
        );

    return (
        <article className="flex flex-col bg-stone-50 font-mono shadow-md border border-stone-200">
            <div className="text-center pt-4 pb-2 px-4">
                <div className="text-base font-black tracking-tight">MeeTea&amp;Poke</div>
                <div className="text-4xl font-black tracking-tight leading-none mt-1">
                    #{String(order.numero_ordine).padStart(3, '0')}
                </div>
            </div>

            <Divider />

            <div className="px-4 text-sm space-y-0.5">
                <div><span className="font-bold">Cliente:</span> {order.nome_cliente}</div>
                <div>
                    <span className="font-bold">Tel:</span>{' '}
                    <a href={`tel:${order.telefono}`} className="hover:underline">
                        {order.telefono}
                    </a>
                </div>
                <div><span className="font-bold">Ritiro:</span> {order.orario_ritiro}</div>
            </div>

            {order.note && (
                <>
                    <Divider />
                    <div className="px-4 text-sm">
                        <span className="font-bold">Note:</span> {order.note}
                    </div>
                </>
            )}

            <Divider />

            <div className="px-4 space-y-2">
                {sortedItems.map((it) => (
                    <ItemDettaglio key={it.id} item={it} />
                ))}
            </div>

            <Divider />

            <div className="px-4 pb-3 flex justify-between font-black text-sm">
                <span>TOTALE</span>
                <span>{totale.toFixed(2)}</span>
            </div>

        </article>
    );
}
