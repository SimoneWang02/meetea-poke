import React from "react";

const totalQty = (map) => Object.values(map).reduce((s, q) => s + q, 0);

export default function MultiSelect({
    titolo,
    items,
    qtyMap,
    onIncrement,
    onDecrement,
    maxIncluso,
    maxHard,
    extraPrezzo,
}) {
    const total = totalQty(qtyMap);
    const atHardMax = total >= maxIncluso;

    return (
        <div>
            <div className="mb-1 flex items-baseline gap-1.5">
                <h3 className="text-sm font-semibold text-stone-800">{titolo}</h3>
                <span className={`text-sm font-medium ${atHardMax ? "text-mint-600" : "text-stone-400"}`}>
                    {total}/{maxIncluso}
                </span>
            </div>
            <ul className="divide-y divide-stone-100">
                {items.map((item) => {
                    const qty = qtyMap[item] ?? 0;
                    const isDisabled = atHardMax && qty === 0;

                    return (
                        <li key={item} className="flex items-center gap-3 py-2.5">
                            {qty === 0 ? (
                                <button
                                    type="button"
                                    onClick={() => onIncrement(item)}
                                    disabled={isDisabled}
                                    aria-label={`Aggiungi ${item}`}
                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-base font-bold transition
                                        ${isDisabled
                                            ? "cursor-not-allowed border-stone-200 text-stone-200"
                                            : "cursor-pointer border-mint-500 text-mint-600 hover:bg-mint-50"
                                        }`}
                                >
                                    +
                                </button>
                            ) : (
                                <div className="flex shrink-0 items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onDecrement(item)}
                                        aria-label={`Rimuovi ${item}`}
                                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-red-300 text-base font-bold text-red-500 transition hover:bg-red-50"
                                    >
                                        −
                                    </button>
                                    <span className="w-5 text-center text-sm font-semibold text-stone-800">
                                        {qty}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onIncrement(item)}
                                        disabled={atHardMax}
                                        aria-label={`Aggiungi ${item}`}
                                        className={`flex h-7 w-7 items-center justify-center rounded-full border text-base font-bold transition
                                            ${atHardMax
                                                ? "cursor-not-allowed border-stone-200 text-stone-200"
                                                : "cursor-pointer border-mint-500 text-mint-600 hover:bg-mint-50"
                                            }`}
                                    >
                                        +
                                    </button>
                                </div>
                            )}
                            <span className={`text-sm ${isDisabled ? "text-stone-300" : "text-stone-700"}`}>
                                {item}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
