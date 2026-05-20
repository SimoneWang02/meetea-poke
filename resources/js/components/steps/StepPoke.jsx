import React, { useState } from "react";
import {
    POKE_DIMENSIONI,
    POKE_BASI,
    POKE_BASI_MAX,
    POKE_PROTEINE,
    POKE_GREEN,
    POKE_CRISPY,
    POKE_SALSE,
} from "../../lib/options";

function MultiSelect({ titolo, items, selected, max, onToggle }) {
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
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
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

export default function StepPoke({ onCancel, onAdd }) {
    const [dimensioneId, setDimensioneId] = useState("");
    const [basi, setBasi] = useState([]);
    const [proteine, setProteine] = useState([]);
    const [green, setGreen] = useState([]);
    const [crispy, setCrispy] = useState([]);
    const [salse, setSalse] = useState([]);
    const [quantita, setQuantita] = useState(1);
    const [error, setError] = useState("");

    const dim = POKE_DIMENSIONI.find((d) => d.id === dimensioneId);

    const makeToggle = (state, setState, max) => (item) => {
        if (state.includes(item)) {
            setState(state.filter((x) => x !== item));
        } else {
            if (state.length >= max) return;
            setState([...state, item]);
        }
    };

    const submit = () => {
        if (!dim) {
            setError("Scegli una dimensione.");
            return;
        }
        if (basi.length === 0) {
            setError("Scegli almeno una base.");
            return;
        }
        if (proteine.length === 0) {
            setError("Scegli almeno una proteina.");
            return;
        }
        onAdd({
            tipo: "poke",
            quantita,
            configurazione: {
                dimensione: dim.id,
                basi,
                proteine,
                green,
                crispy,
                salse,
            },
        });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight">
                🥗 Componi la tua poke bowl
            </h2>

            <div className="mt-6 space-y-6">
                <div>
                    <div className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                        Dimensione
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                        {POKE_DIMENSIONI.map((d) => {
                            const active = dimensioneId === d.id;
                            return (
                                <button
                                    key={d.id}
                                    type="button"
                                    onClick={() => setDimensioneId(d.id)}
                                    className={`rounded-xl border px-4 py-3 text-left transition ${
                                        active
                                            ? "border-mint-500 bg-mint-50 ring-2 ring-mint-300"
                                            : "border-stone-200 bg-white hover:border-stone-300"
                                    }`}
                                >
                                    <div className="flex items-baseline justify-between gap-2">
                                        <span className="text-lg font-bold">
                                            {d.nome}
                                        </span>
                                        <span className="text-base font-extrabold text-mint-700">
                                            {d.prezzo.toFixed(2)} €
                                        </span>
                                    </div>
                                    <div className="mt-1 text-xs text-stone-500">
                                        {d.proteine} prot · {d.green} green ·{" "}
                                        {d.crispy} crispy · {d.salse} sals
                                        {d.salse > 1 ? "e" : "a"}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {dim && (
                    <>
                        <MultiSelect
                            titolo="Basi"
                            items={POKE_BASI}
                            selected={basi}
                            max={POKE_BASI_MAX}
                            onToggle={makeToggle(basi, setBasi, POKE_BASI_MAX)}
                        />

                        <MultiSelect
                            titolo="Proteine"
                            items={POKE_PROTEINE}
                            selected={proteine}
                            max={dim.proteine}
                            onToggle={makeToggle(
                                proteine,
                                setProteine,
                                dim.proteine,
                            )}
                        />

                        <MultiSelect
                            titolo="Green & co"
                            items={POKE_GREEN}
                            selected={green}
                            max={dim.green}
                            onToggle={makeToggle(green, setGreen, dim.green)}
                        />

                        <MultiSelect
                            titolo="Crispy"
                            items={POKE_CRISPY}
                            selected={crispy}
                            max={dim.crispy}
                            onToggle={makeToggle(crispy, setCrispy, dim.crispy)}
                        />

                        <MultiSelect
                            titolo="Salse"
                            items={POKE_SALSE}
                            selected={salse}
                            max={dim.salse}
                            onToggle={makeToggle(salse, setSalse, dim.salse)}
                        />
                    </>
                )}

                <div>
                    <div className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                        Quantità
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                setQuantita(Math.max(1, quantita - 1))
                            }
                            className="h-12 w-12 rounded-xl border border-stone-200 bg-white text-xl font-bold text-stone-700 transition hover:bg-stone-50"
                        >
                            −
                        </button>
                        <span className="w-12 text-center text-2xl font-bold">
                            {quantita}
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                setQuantita(Math.min(10, quantita + 1))
                            }
                            className="h-12 w-12 rounded-xl border border-stone-200 bg-white text-xl font-bold text-stone-700 transition hover:bg-stone-50"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
                    {error}
                </div>
            )}

            <div className="mt-8 flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 font-semibold text-stone-700 transition hover:bg-stone-50"
                >
                    Indietro
                </button>
                <button
                    type="button"
                    onClick={submit}
                    className="flex-[2] rounded-xl bg-mint-600 px-4 py-3 font-semibold text-white transition hover:bg-mint-700"
                >
                    Aggiungi al carrello
                </button>
            </div>
        </div>
    );
}
