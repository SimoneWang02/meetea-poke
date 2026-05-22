import React from "react";

function itemSubtotale(item) {
    const base = item.prezzo_base ?? 0;
    const toppings = (item.configurazione?.toppings ?? []).reduce(
        (s, t) => s + (t.prezzo ?? 0),
        0,
    );
    return (base + toppings) * (item.quantita ?? 1);
}

function ItemIcon({ tipo }) {
    if (tipo === "poke") return <span className="text-2xl">🥗</span>;
    if (tipo === "bubbletea") return <span className="text-2xl">🧋</span>;
    return <span className="text-2xl">🍡</span>;
}

function ItemDetails({ item }) {
    const cfg = item.configurazione ?? {};
    if (item.tipo === "poke") {
        return (
            <ul className="mt-3 space-y-1 text-sm text-stone-700">
                <li>
                    • Dimensione:{" "}
                    <span className="font-medium capitalize">
                        {cfg.dimensione}
                    </span>
                </li>
                <li>
                    • Basi:{" "}
                    <span className="font-medium">{cfg.basi?.join(", ")}</span>
                </li>
                <li>
                    • Proteine:{" "}
                    <span className="font-medium">
                        {cfg.proteine?.join(", ")}
                    </span>
                </li>
                {cfg.green?.length > 0 && (
                    <li>
                        • Green:{" "}
                        <span className="font-medium">
                            {cfg.green.join(", ")}
                        </span>
                    </li>
                )}
                {cfg.crispy?.length > 0 && (
                    <li>
                        • Crispy:{" "}
                        <span className="font-medium">
                            {cfg.crispy.join(", ")}
                        </span>
                    </li>
                )}
                {cfg.salse?.length > 0 && (
                    <li>
                        • Salse:{" "}
                        <span className="font-medium">
                            {cfg.salse.join(", ")}
                        </span>
                    </li>
                )}
            </ul>
        );
    }
    if (item.tipo === "bubbletea") {
        const sizeLabel =
            cfg.size === "M" ? "Media" : cfg.size === "G" ? "Grande" : cfg.size;
        const toppings = cfg.toppings ?? [];
        return (
            <ul className="mt-3 space-y-1 text-sm text-stone-700">
                <li>
                    • Dimensione:{" "}
                    <span className="font-medium">{sizeLabel}</span>
                </li>
                <li>
                    • Temperatura:{" "}
                    <span className="font-medium capitalize">
                        {cfg.temperatura}
                    </span>
                </li>
                {toppings.length > 0 && (
                    <li>
                        • Toppings:{" "}
                        <span className="font-medium">
                            {toppings
                                .map((t) =>
                                    t.gusto ? `${t.nome} (${t.gusto})` : t.nome,
                                )
                                .join(", ")}
                        </span>
                    </li>
                )}
            </ul>
        );
    }
    if (item.tipo === "sfizio") {
        return (
            <ul className="mt-3 space-y-1 text-sm text-stone-700">
                <li>
                    • Porzione:{" "}
                    <span className="font-medium">{cfg.porzione}</span>
                </li>
            </ul>
        );
    }
    return null;
}

function ItemRow({ item, onRemove }) {
    return (
        <div className="rounded-2xl bg-white p-5 ring-1 ring-stone-200">
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <ItemIcon tipo={item.tipo} />
                    <div className="min-w-0">
                        <div className="truncate font-bold">{item.nome}</div>
                        <div className="text-sm text-stone-500">
                            Quantità: {item.quantita ?? 1}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="font-extrabold text-stone-900">
                        {itemSubtotale(item).toFixed(2)} €
                    </div>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-xs font-medium text-red-600 hover:text-red-700 cursor-pointer"
                    >
                        Rimuovi
                    </button>
                </div>
            </div>

            <ItemDetails item={item} />
        </div>
    );
}

export default function StepRiepilogo({
    items,
    onRemove,
    onAddAnother,
    onProcedi,
}) {
    const totale = items.reduce((s, it) => s + itemSubtotale(it), 0);

    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Il tuo ordine</h2>
            <p className="mt-1 text-stone-600">
                {items.length} articol
                {items.length === 1 ? "o" : "i"} nel carrello.
            </p>

            <div className="mt-6 space-y-3">
                {items.map((it, idx) => (
                    <ItemRow
                        key={idx}
                        item={it}
                        onRemove={() => onRemove(idx)}
                    />
                ))}
            </div>

            {items.length > 0 && (
                <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-5 ring-1 ring-stone-200">
                    <span className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                        Totale
                    </span>
                    <span className="text-2xl font-extrabold text-mint-700">
                        {totale.toFixed(2)} €
                    </span>
                </div>
            )}

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
