import React from "react";

function itemSubtotale(item) {
    const base = item.prezzo_base ?? 0;
    const toppings = (item.configurazione?.toppings ?? []).reduce(
        (s, t) => s + (t.prezzo ?? 0),
        0,
    );
    return (base + toppings) * (item.quantita ?? 1);
}

function CartItem({ item, onRemove }) {
    return (
        <div className="flex items-center gap-3 rounded-xl bg-stone-50 px-3 py-2.5">
            <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-stone-800">
                    {item.nome}
                </div>
                {(item.quantita ?? 1) > 1 && (
                    <div className="text-xs text-stone-500">
                        ×{item.quantita}
                    </div>
                )}
            </div>
            <div className="shrink-0 text-sm font-bold text-stone-800">
                {itemSubtotale(item).toFixed(2)} €
            </div>
            <button
                type="button"
                onClick={onRemove}
                aria-label="Rimuovi articolo"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-stone-400 transition hover:bg-red-100 hover:text-red-600"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-stone-400">
                    <circle cx="9" cy="20" r="1.5" />
                    <circle cx="17" cy="20" r="1.5" />
                    <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.5L21 8H6" />
                </svg>
            </div>
            <div>
                <p className="font-semibold text-stone-700">Il carrello è vuoto</p>
                <p className="mt-1 text-sm text-stone-400">Aggiungi qualcosa dal menu!</p>
            </div>
        </div>
    );
}

export default function CartSidebar({ items, onRemove, onProcedi, headerHeight = 120 }) {
    const totale = items.reduce((s, it) => s + itemSubtotale(it), 0);
    const totaleItems = items.reduce((s, it) => s + (it.quantita ?? 1), 0);

    return (
        <div
            className="hidden lg:block"
            style={{ position: "sticky", top: headerHeight + 32 }}
        >
            <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200 shadow-sm">
                {/* Header */}
                <div className="flex items-baseline justify-between border-b border-stone-100 px-5 py-4">
                    <h2 className="text-base font-bold text-stone-900">Il tuo ordine</h2>
                    {totaleItems > 0 && (
                        <span className="text-sm text-stone-500">
                            {totaleItems} articol{totaleItems === 1 ? "o" : "i"}
                        </span>
                    )}
                </div>

                {/* Items or empty */}
                {items.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div
                        className="overflow-y-auto px-3 py-3"
                        style={{ maxHeight: `calc(100vh - ${headerHeight + 200}px)` }}
                    >
                        <div className="space-y-1.5">
                            {items.map((item, idx) => (
                                <CartItem
                                    key={idx}
                                    item={item}
                                    onRemove={() => onRemove(idx)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-stone-100 px-5 py-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                                Totale
                            </span>
                            <span className="text-xl font-extrabold text-mint-700">
                                {totale.toFixed(2)} €
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={onProcedi}
                            className="mt-3 w-full rounded-xl bg-mint-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-mint-700"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Procedi All'Ordine
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M13 6l6 6-6 6"/>
                                </svg>
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
