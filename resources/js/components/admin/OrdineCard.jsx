import React from 'react';
import StatoBadge from './StatoBadge';

function ItemDettaglio({ item }) {
    const cfg = item.configurazione || {};
    return (
        <div className="rounded-xl bg-stone-50 p-3 ring-1 ring-stone-200">
            <div className="flex items-center justify-between">
                <div className="font-semibold">
                    {item.tipo === 'poke' ? '🥗 Poke Bowl' : '🧋 Bubble Tea'}
                </div>
                <div className="text-sm font-bold text-mint-700">
                    × {item.quantita}
                </div>
            </div>
            <ul className="mt-2 space-y-0.5 text-sm text-stone-700">
                {item.tipo === 'poke' ? (
                    <>
                        <li>Dimensione: <span className="font-medium capitalize">{cfg.dimensione}</span></li>
                        <li>Basi: <span className="font-medium">{(cfg.basi || []).join(', ')}</span></li>
                        <li>Proteine: <span className="font-medium">{(cfg.proteine || []).join(', ')}</span></li>
                        <li>Green: <span className="font-medium">{(cfg.green || []).join(', ') || '—'}</span></li>
                        <li>Crispy: <span className="font-medium">{(cfg.crispy || []).join(', ') || '—'}</span></li>
                        <li>Salse: <span className="font-medium">{(cfg.salse || []).join(', ') || '—'}</span></li>
                    </>
                ) : (
                    <>
                        <li>Tea: <span className="font-medium">{cfg.tea}</span></li>
                        <li>Latte: <span className="font-medium">{cfg.latte}</span></li>
                        <li>Pearls: <span className="font-medium">{cfg.pearls}</span></li>
                        <li>Dolcezza: <span className="font-medium">{cfg.dolcezza}</span></li>
                        <li>Ghiaccio: <span className="font-medium">{cfg.ghiaccio}</span></li>
                    </>
                )}
            </ul>
        </div>
    );
}

export default function OrdineCard({ order, onAdvance }) {
    const next = order.stato === 'nuovo' ? 'in_preparazione' : order.stato === 'in_preparazione' ? 'pronto' : null;
    const buttonLabel =
        order.stato === 'nuovo'
            ? 'Inizia preparazione'
            : order.stato === 'in_preparazione'
            ? 'Segna come pronto'
            : null;

    return (
        <article className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
            <header className="flex items-start justify-between gap-2">
                <div>
                    <div className="text-2xl font-extrabold tracking-tight">
                        {order.numero_ordine}
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1 text-base font-semibold text-mint-700">
                        🕐 {order.orario_ritiro}
                    </div>
                </div>
                <StatoBadge stato={order.stato} />
            </header>

            <div className="mt-3 border-t border-stone-100 pt-3">
                <div className="font-semibold">{order.nome_cliente}</div>
                <a
                    href={`tel:${order.telefono}`}
                    className="text-sm text-stone-600 hover:text-stone-800"
                >
                    📞 {order.telefono}
                </a>
            </div>

            <div className="mt-3 space-y-2">
                {order.items?.map((it) => (
                    <ItemDettaglio key={it.id} item={it} />
                ))}
            </div>

            {order.note && (
                <div className="mt-3 rounded-xl bg-accent-50 p-3 text-sm text-accent-700 ring-1 ring-accent-200">
                    <span className="font-semibold">📝 Note:</span> {order.note}
                </div>
            )}

            {next && (
                <button
                    type="button"
                    onClick={() => onAdvance(order.id, next)}
                    className={`mt-4 w-full rounded-xl px-4 py-3 font-semibold text-white transition ${
                        order.stato === 'nuovo'
                            ? 'bg-yellow-500 hover:bg-yellow-600'
                            : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {buttonLabel}
                </button>
            )}
        </article>
    );
}
