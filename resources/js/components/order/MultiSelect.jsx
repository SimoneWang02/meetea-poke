import React from "react";

export default function MultiSelect({
    titolo,
    items,
    selected,
    max,
    onToggle,
    extraPrezzo,
}) {
    return (
        <div>
            <div className="mb-1 flex items-baseline justify-between">
                <h3 className="text-sm font-semibold text-stone-800">
                    {titolo}{" "}
                    <span className="font-normal text-stone-400">
                        {extraPrezzo
                            ? `(Extra +${extraPrezzo.toFixed(2).replace(".", ",")} €)`
                            : `(max ${max})`}
                    </span>
                </h3>
                <span className="text-sm text-stone-500">
                    {selected.length}/{max}
                </span>
            </div>
            <ul className="divide-y divide-stone-100">
                {items.map((item) => {
                    const isChecked = selected.includes(item);
                    const isDisabled =
                        !extraPrezzo && !isChecked && selected.length >= max;
                    return (
                        <li key={item}>
                            <label
                                className={`flex items-center gap-3 py-2.5 ${
                                    isDisabled
                                        ? "cursor-not-allowed opacity-40"
                                        : "cursor-pointer"
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => onToggle(item)}
                                    disabled={isDisabled}
                                    className="h-4 w-4 accent-mint-600"
                                />
                                <span className="text-sm text-stone-700">
                                    {item}
                                </span>
                            </label>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
