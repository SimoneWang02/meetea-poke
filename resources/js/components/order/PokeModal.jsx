import React, { useState } from "react";
import {
    POKE_BASI,
    POKE_BASI_MAX,
    POKE_PROTEINE,
    POKE_GREEN,
    POKE_CRISPY,
    POKE_SALSE,
    POKE_EXTRA_PREZZI,
} from "../../lib/options";
import ModalShell from "./ModalShell";
import MultiSelect from "./MultiSelect";

export default function PokeModal({ open, dimensione, onClose, onAdd, initialConfig, initialQuantita = 1 }) {
    const [basi, setBasi] = useState(initialConfig?.basi ?? []);
    const [proteine, setProteine] = useState(initialConfig?.proteine ?? []);
    const [green, setGreen] = useState(initialConfig?.green ?? []);
    const [crispy, setCrispy] = useState(initialConfig?.crispy ?? []);
    const [salse, setSalse] = useState(initialConfig?.salse ?? []);
    const [quantita, setQuantita] = useState(initialQuantita);
    const [error, setError] = useState("");

    if (!dimensione) return null;

    const extraCost =
        Math.max(0, proteine.length - dimensione.proteine) *
            POKE_EXTRA_PREZZI.proteine +
        Math.max(0, green.length - dimensione.green) * POKE_EXTRA_PREZZI.green +
        Math.max(0, crispy.length - dimensione.crispy) *
            POKE_EXTRA_PREZZI.crispy +
        Math.max(0, salse.length - dimensione.salse) * POKE_EXTRA_PREZZI.salse;
    const prezzoTotale = dimensione.prezzo + extraCost;

    const makeToggle =
        (state, setState, max = Infinity) =>
        (item) => {
            if (state.includes(item)) {
                setState(state.filter((x) => x !== item));
            } else {
                if (state.length >= max) return;
                setState([...state, item]);
            }
        };

    const submit = () => {
        if (basi.length === 0) {
            setError("Scegli almeno una base.");
            return;
        }
        if (proteine.length === 0) {
            setError("Scegli almeno una proteina.");
            return;
        }
        const extras = {};
        const addExtras = (key, items, max, prezzo) => {
            const e = items.slice(max);
            if (e.length > 0) extras[key] = e.map((nome) => ({ nome, prezzo }));
        };
        addExtras("proteine", proteine, dimensione.proteine, POKE_EXTRA_PREZZI.proteine);
        addExtras("green", green, dimensione.green, POKE_EXTRA_PREZZI.green);
        addExtras("crispy", crispy, dimensione.crispy, POKE_EXTRA_PREZZI.crispy);
        addExtras("salse", salse, dimensione.salse, POKE_EXTRA_PREZZI.salse);
        onAdd({
            tipo: "poke",
            nome: `Poke Bowl ${dimensione.nome}`,
            prezzo_base: prezzoTotale,
            quantita,
            configurazione: {
                dimensione: dimensione.id,
                basi,
                proteine,
                green,
                crispy,
                salse,
                extras,
            },
        });
    };

    const footer = (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setQuantita(Math.max(1, quantita - 1))}
                    className="h-10 w-10 rounded-full border border-stone-200 text-lg font-bold text-stone-700 transition hover:bg-stone-50"
                    aria-label="Diminuisci quantità"
                >
                    −
                </button>
                <span className="w-8 text-center text-lg font-bold">
                    {quantita}
                </span>
                <button
                    type="button"
                    onClick={() => setQuantita(Math.min(10, quantita + 1))}
                    className="h-10 w-10 rounded-full border border-stone-200 text-lg font-bold text-stone-700 transition hover:bg-stone-50"
                    aria-label="Aumenta quantità"
                >
                    +
                </button>
            </div>
            <button
                type="button"
                onClick={submit}
                className="flex-1 rounded-xl bg-mint-600 px-4 py-3 font-semibold text-white transition hover:bg-mint-700"
            >
                {initialConfig ? "Salva" : "Aggiungi"} · {(prezzoTotale * quantita).toFixed(2)} €
            </button>
        </div>
    );

    return (
        <ModalShell
            open={open}
            onClose={onClose}
            title={`Poke Bowl ${dimensione.nome}`}
            footer={footer}
        >
            <div className="space-y-6">
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
                    max={dimensione.proteine}
                    extraPrezzo={POKE_EXTRA_PREZZI.proteine}
                    onToggle={makeToggle(proteine, setProteine)}
                />
                <MultiSelect
                    titolo="Green & Co"
                    items={POKE_GREEN}
                    selected={green}
                    max={dimensione.green}
                    extraPrezzo={POKE_EXTRA_PREZZI.green}
                    onToggle={makeToggle(green, setGreen)}
                />
                <MultiSelect
                    titolo="Crispy"
                    items={POKE_CRISPY}
                    selected={crispy}
                    max={dimensione.crispy}
                    extraPrezzo={POKE_EXTRA_PREZZI.crispy}
                    onToggle={makeToggle(crispy, setCrispy)}
                />
                <MultiSelect
                    titolo="Salse"
                    items={POKE_SALSE}
                    selected={salse}
                    max={dimensione.salse}
                    extraPrezzo={POKE_EXTRA_PREZZI.salse}
                    onToggle={makeToggle(salse, setSalse)}
                />
            </div>

            {error && (
                <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
                    {error}
                </div>
            )}
        </ModalShell>
    );
}
