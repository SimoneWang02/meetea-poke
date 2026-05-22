import React, { useState } from "react";
import {
    POKE_BASI,
    POKE_BASI_MAX,
    POKE_PROTEINE,
    POKE_GREEN,
    POKE_CRISPY,
    POKE_SALSE,
} from "../../lib/options";
import ModalShell from "./ModalShell";
import MultiSelect from "./MultiSelect";

export default function PokeModal({ open, dimensione, onClose, onAdd }) {
    const [basi, setBasi] = useState([]);
    const [proteine, setProteine] = useState([]);
    const [green, setGreen] = useState([]);
    const [crispy, setCrispy] = useState([]);
    const [salse, setSalse] = useState([]);
    const [quantita, setQuantita] = useState(1);
    const [error, setError] = useState("");

    if (!dimensione) return null;

    const makeToggle = (state, setState, max) => (item) => {
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
        onAdd({
            tipo: "poke",
            nome: `Poke Bowl ${dimensione.nome}`,
            prezzo_base: dimensione.prezzo,
            quantita,
            configurazione: {
                dimensione: dimensione.id,
                basi,
                proteine,
                green,
                crispy,
                salse,
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
                Aggiungi · {(dimensione.prezzo * quantita).toFixed(2)} €
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-mint-50 px-3 py-1 text-xs font-semibold text-mint-800">
                {dimensione.proteine} prot · {dimensione.green} green ·{" "}
                {dimensione.crispy} crispy · {dimensione.salse} sals
                {dimensione.salse > 1 ? "e" : "a"}
            </div>

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
                    onToggle={makeToggle(proteine, setProteine, dimensione.proteine)}
                />
                <MultiSelect
                    titolo="Green & co"
                    items={POKE_GREEN}
                    selected={green}
                    max={dimensione.green}
                    onToggle={makeToggle(green, setGreen, dimensione.green)}
                />
                <MultiSelect
                    titolo="Crispy"
                    items={POKE_CRISPY}
                    selected={crispy}
                    max={dimensione.crispy}
                    onToggle={makeToggle(crispy, setCrispy, dimensione.crispy)}
                />
                <MultiSelect
                    titolo="Salse"
                    items={POKE_SALSE}
                    selected={salse}
                    max={dimensione.salse}
                    onToggle={makeToggle(salse, setSalse, dimensione.salse)}
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
