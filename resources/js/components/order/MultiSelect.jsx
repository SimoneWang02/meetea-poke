import React from "react";

export default function MultiSelect({ titolo, items, selected, max, onToggle }) {
    return (
        <div>
            <div className="flex items-baseline justify-between">
                <div className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                    {titolo}{" "}
                    <span className="font-normal normal-case text-stone-400">
                        (max {max})
                    </span>
                </div>
                <div className="text-sm text-stone-500">
                    {selected.length}/{max}
                </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {items.map((it) => {
                    const active = selected.includes(it);
                    const disabled = !active && selected.length >= max;
                    return (
                        <button
                            key={it}
                            type="button"
                            disabled={disabled}
                            onClick={() => onToggle(it)}
                            className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                                active
                                    ? "border-mint-500 bg-mint-100 text-mint-900"
                                    : disabled
                                      ? "border-stone-200 bg-stone-50 text-stone-300"
                                      : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
                            }`}
                        >
                            {it}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
