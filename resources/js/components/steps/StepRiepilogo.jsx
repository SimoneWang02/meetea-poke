import React from "react";
import { formatPrezzo } from "../../lib/format";

function itemSubtotale(item) {
    return (item.prezzo_base ?? 0) * (item.quantita ?? 1);
}

function ItemIcon({ tipo }) {
    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint-100">
            {tipo === "poke" && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-mint-600"
                    aria-hidden="true"
                >
                    <path d="M20.3872 6.57272C21.1892 5.75419 21.1846 4.44036 20.3728 3.62792C19.5609 2.81548 18.2477 2.81047 17.4298 3.61305C16.613 2.79565 15.2887 2.79565 14.4719 3.61305C14.2166 3.86861 14.0411 4.17381 13.9454 4.49761C13.1593 4.09519 12.172 4.22318 11.5141 4.88166C10.9363 5.45991 10.7676 6.29216 11.0073 7.01913C10.5005 7.03944 9.99957 7.24304 9.61259 7.63031C8.7958 8.44771 8.7958 9.77299 9.61259 10.5904C10.2671 11.2454 10.5137 12.1539 10.3524 13H18.3C18.5997 12.9008 18.8815 12.732 19.12 12.4933C19.7781 11.8347 19.9057 10.8465 19.5033 10.0597C19.827 9.964 20.1322 9.78884 20.3876 9.53322C21.2044 8.71581 21.204 7.39013 20.3872 6.57272Z" />
                    <path d="M17 7L11 13" />
                    <path d="M13.8889 21H10.1111C6.18375 21 3 17.8162 3 13.8889C3 13.398 3.39797 13 3.88889 13H20.1111C20.602 13 21 13.398 21 13.8889C21 17.8162 17.8162 21 13.8889 21Z" />
                    <path d="M5.67133 13C4.65183 12.175 4 10.9136 4 9.5C4 7.01472 6.01472 5 8.5 5C9.42507 5 10.285 5.27914 11 5.75777" />
                </svg>
            )}
            {tipo === "bubbletea" && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-5 w-5 text-mint-600"
                    aria-hidden="true"
                >
                    <path
                        d="M18 9L16.5218 18.4136C16.2728 19.9992 16.1483 20.7921 15.5864 21.2644C14.3865 22.273 9.54699 22.217 8.41358 21.2644C7.85167 20.7921 7.72718 19.9992 7.47819 18.4136L6 9"
                        strokeLinecap="round"
                    />
                    <path d="M6 9L6.51444 7.71391C7.41167 5.47084 9.58414 4 12 4C14.4159 4 16.5883 5.47084 17.4856 7.71391L18 9" />
                    <path d="M5 9H19" strokeLinecap="round" />
                    <path d="M13 9L16 2" strokeLinecap="round" />
                    <path
                        d="M13.125 13H13M13.25 13C13.25 13.1381 13.1381 13.25 13 13.25C12.8619 13.25 12.75 13.1381 12.75 13C12.75 12.8619 12.8619 12.75 13 12.75C13.1381 12.75 13.25 12.8619 13.25 13Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M13.625 18H13.5M13.75 18C13.75 18.1381 13.6381 18.25 13.5 18.25C13.3619 18.25 13.25 18.1381 13.25 18C13.25 17.8619 13.3619 17.75 13.5 17.75C13.6381 17.75 13.75 17.8619 13.75 18Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M10.125 15.5H10M10.25 15.5C10.25 15.6381 10.1381 15.75 10 15.75C9.86193 15.75 9.75 15.6381 9.75 15.5C9.75 15.3619 9.86193 15.25 10 15.25C10.1381 15.25 10.25 15.3619 10.25 15.5Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )}
            {tipo === "sfizio" && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-mint-600"
                    aria-hidden="true"
                >
                    <path d="M20.9289 12.4256C19.0837 14.2708 15.4938 13.6725 12.9106 11.0893C10.3273 8.50608 9.729 4.91622 11.5742 3.07109M20.9289 12.4256C22.7741 10.5805 22.1757 6.99064 19.5925 4.40745C17.0093 1.82427 13.4193 1.22596 11.5742 3.07109M20.9289 12.4256C17.2538 16.1006 10.2378 17.7707 8.2332 15.7662C6.22862 13.7616 7.8991 6.74609 11.5742 3.07109M7.23091 14.7646L5.22633 16.7692C4.48826 16.0311 3.29162 16.0311 2.55355 16.7692C1.81548 17.5072 1.81548 18.7039 2.55355 19.4419C2.95334 19.8417 3.48753 20.0227 4.01066 19.9894C3.97734 20.5125 4.15835 21.0467 4.55813 21.4465C5.2962 22.1845 6.49284 22.1845 7.23091 21.4465C7.96898 20.7084 7.96898 19.5118 7.23091 18.7737L9.2355 16.7692M16 7.5L16.5 8M16.9197 8.41764C16.7352 8.60215 16.2865 8.45257 15.9174 8.08355C15.5484 7.71452 15.3988 7.26579 15.5833 7.08128C15.7679 6.89676 16.2166 7.04634 16.5856 7.41537C16.9547 7.78439 17.1042 8.23312 16.9197 8.41764Z" />
                </svg>
            )}
            {tipo === "bevande" && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-mint-600"
                    aria-hidden="true"
                >
                    <path d="M8 2h8l-1 4H9z" />
                    <path d="M7 6h10l-1.2 14.2A2 2 0 0 1 13.81 22h-3.62a2 2 0 0 1-1.99-1.8L7 6z" />
                </svg>
            )}
        </div>
    );
}

function PokeCategoryRow({ label, items = [], extras = [] }) {
    const extraNames = new Set(extras.map((e) => e.nome));
    const included = items.filter((n) => !extraNames.has(n));
    if (included.length === 0 && extras.length === 0) return null;
    return (
        <li>
            {included.length > 0 && (
                <span>
                    • {label}:{" "}
                    <span className="font-medium">{included.join(", ")}</span>
                </span>
            )}
            {extras.map((e) => (
                <div
                    key={e.nome}
                    className="ml-6 mt-0.5 text-xs text-stone-500"
                >
                    {e.nome}{" "}
                    <span className="font-semibold text-stone-600">
                        +{formatPrezzo(e.prezzo)}
                    </span>
                </div>
            ))}
        </li>
    );
}

export function ItemDetails({ item, className = "mt-3 space-y-1 text-sm text-stone-700" }) {
    const cfg = item.configurazione ?? {};
    if (item.tipo === "poke") {
        const extras = cfg.extras ?? {};
        return (
            <ul className={className}>
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
                <PokeCategoryRow
                    label="Proteine"
                    items={cfg.proteine}
                    extras={extras.proteine}
                />
                <PokeCategoryRow
                    label="Green"
                    items={cfg.green}
                    extras={extras.green}
                />
                <PokeCategoryRow
                    label="Crispy"
                    items={cfg.crispy}
                    extras={extras.crispy}
                />
                <PokeCategoryRow
                    label="Salse"
                    items={cfg.salse}
                    extras={extras.salse}
                />
            </ul>
        );
    }
    if (item.tipo === "bubbletea") {
        const sizeLabel =
            cfg.size === "M" ? "Media" : cfg.size === "G" ? "Grande" : cfg.size;
        const toppings = cfg.toppings ?? [];
        return (
            <ul className={className}>
                <li>
                    • Dimensione:{" "}
                    <span className="font-medium">{sizeLabel}</span>
                </li>
                {cfg.base && (
                    <li>
                        • Base:{" "}
                        <span className="font-medium">{cfg.base}</span>
                    </li>
                )}
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
            <ul className={className}>
                <li>
                    • Porzione:{" "}
                    <span className="font-medium">{cfg.porzione}</span>
                </li>
                {cfg.gusti?.length > 0 && (
                    <li>
                        • Gusti:{" "}
                        <span className="font-medium">{cfg.gusti.join(", ")}</span>
                    </li>
                )}
                {cfg.gusto && (
                    <li>
                        • Gusto:{" "}
                        <span className="font-medium">{cfg.gusto}</span>
                    </li>
                )}
            </ul>
        );
    }
    if (item.tipo === "bevande") {
        return null;
    }
    return null;
}

function ItemRow({ item, onRemove, onEdit }) {
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
                        {formatPrezzo(itemSubtotale(item))}
                    </div>
                    <div className="flex gap-3">
                        {item.tipo !== "bevande" && (
                            <button
                                type="button"
                                onClick={onEdit}
                                className="text-xs font-medium text-mint-600 hover:text-mint-700 cursor-pointer"
                            >
                                Modifica
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onRemove}
                            className="text-xs font-medium text-red-600 hover:text-red-700 cursor-pointer"
                        >
                            Rimuovi
                        </button>
                    </div>
                </div>
            </div>

            <ItemDetails item={item} />
        </div>
    );
}

export default function StepRiepilogo({
    items,
    onRemove,
    onEdit,
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
                        onEdit={() => onEdit(idx)}
                    />
                ))}
            </div>

            {items.length > 0 && (
                <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-5 ring-1 ring-stone-200">
                    <span className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                        Totale
                    </span>
                    <span className="text-2xl font-extrabold text-mint-700">
                        {formatPrezzo(totale)}
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
                    <span className="flex items-center justify-center gap-2">
                        Procedi
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                    </span>
                </button>
            </div>
        </div>
    );
}
