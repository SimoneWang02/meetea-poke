import React from 'react';

function ItemRow({ item, onRemove }) {
    const cfg = item.configurazione;
    return (
        <div className="rounded-2xl bg-white p-5 ring-1 ring-stone-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">
                        {item.tipo === 'poke' ? '🥗' : '🧋'}
                    </span>
                    <div>
                        <div className="font-bold">
                            {item.tipo === 'poke' ? 'Poke Bowl' : 'Bubble Tea'}
                        </div>
                        <div className="text-sm text-stone-500">
                            Quantità: {item.quantita}
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onRemove}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                    Rimuovi
                </button>
            </div>

            <ul className="mt-4 space-y-1 text-sm text-stone-700">
                {item.tipo === 'poke' ? (
                    <>
                        <li>• Base: <span className="font-medium">{cfg.base}</span></li>
                        <li>• Proteina: <span className="font-medium">{cfg.proteina}</span></li>
                        <li>• Topping: <span className="font-medium">{cfg.topping?.join(', ')}</span></li>
                        <li>• Salsa: <span className="font-medium">{cfg.salsa}</span></li>
                    </>
                ) : (
                    <>
                        <li>• Tea: <span className="font-medium">{cfg.tea}</span></li>
                        <li>• Latte: <span className="font-medium">{cfg.latte}</span></li>
                        <li>• Pearls: <span className="font-medium">{cfg.pearls}</span></li>
                        <li>• Dolcezza: <span className="font-medium">{cfg.dolcezza}</span></li>
                        <li>• Ghiaccio: <span className="font-medium">{cfg.ghiaccio}</span></li>
                    </>
                )}
            </ul>
        </div>
    );
}

export default function StepRiepilogo({ items, onRemove, onAddAnother, onProcedi }) {
    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Il tuo ordine</h2>
            <p className="mt-1 text-stone-600">
                {items.length} articol{items.length === 1 ? 'o' : 'i'} nel carrello.
            </p>

            <div className="mt-6 space-y-3">
                {items.map((it, idx) => (
                    <ItemRow key={idx} item={it} onRemove={() => onRemove(idx)} />
                ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={onAddAnother}
                    className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 font-semibold text-stone-700 transition hover:bg-stone-50"
                >
                    + Aggiungi un altro articolo
                </button>
                <button
                    type="button"
                    onClick={onProcedi}
                    disabled={items.length === 0}
                    className="flex-1 rounded-xl bg-mint-600 px-4 py-3 font-semibold text-white transition hover:bg-mint-700 disabled:cursor-not-allowed disabled:bg-stone-300"
                >
                    Procedi →
                </button>
            </div>
        </div>
    );
}
