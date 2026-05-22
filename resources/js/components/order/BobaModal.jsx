import React, { useMemo, useState } from "react";
import { BOBA_TOPPING } from "../../lib/options";
import ModalShell from "./ModalShell";

const TEMPERATURE = [
    { id: "fredda", label: "Fredda" },
    { id: "calda", label: "Calda" },
];

export default function BobaModal({ open, item, categoria, onClose, onAdd }) {
    const availableSizes = useMemo(
        () => (item ? Object.keys(item.prezzi) : []),
        [item],
    );

    const [size, setSize] = useState(availableSizes[0] ?? "G");
    const [temperatura, setTemperatura] = useState("fredda");
    const [singoli, setSingoli] = useState([]); // names
    const [gruppi, setGruppi] = useState({}); // { Gelatine: "Mela", Palline: "Mango" }
    const [quantita, setQuantita] = useState(1);

    if (!item) return null;

    const toggleSingolo = (nome) => {
        setSingoli((prev) =>
            prev.includes(nome) ? prev.filter((n) => n !== nome) : [...prev, nome],
        );
    };

    const setGruppo = (gruppoNome, gusto) => {
        setGruppi((prev) => {
            const next = { ...prev };
            if (!gusto) {
                delete next[gruppoNome];
            } else {
                next[gruppoNome] = gusto;
            }
            return next;
        });
    };

    const toppingsArr = [
        ...BOBA_TOPPING.singoli
            .filter((t) => singoli.includes(t.nome))
            .map((t) => ({ nome: t.nome, prezzo: t.prezzo })),
        ...Object.entries(gruppi).map(([nome, gusto]) => {
            const g = BOBA_TOPPING.gruppi.find((x) => x.nome === nome);
            return { nome, gusto, prezzo: g?.prezzo ?? 0 };
        }),
    ];

    const prezzoBase = item.prezzi[size] ?? 0;
    const prezzoToppings = toppingsArr.reduce((s, t) => s + (t.prezzo ?? 0), 0);
    const totale = (prezzoBase + prezzoToppings) * quantita;

    const submit = () => {
        onAdd({
            tipo: "bubbletea",
            nome: item.nome,
            categoria,
            prezzo_base: prezzoBase,
            quantita,
            configurazione: {
                size,
                temperatura,
                toppings: toppingsArr,
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
                className="flex-1 rounded-xl bg-accent-500 px-4 py-3 font-semibold text-white transition hover:bg-accent-600"
            >
                Aggiungi · {totale.toFixed(2)} €
            </button>
        </div>
    );

    return (
        <ModalShell
            open={open}
            onClose={onClose}
            title={item.nome}
            footer={footer}
        >
            {item.ingredienti && (
                <p className="-mt-1 mb-4 text-sm text-stone-600">
                    {item.ingredienti}
                </p>
            )}

            {availableSizes.length > 1 && (
                <Section titolo="Dimensione">
                    <div className="grid grid-cols-2 gap-2">
                        {availableSizes.map((s) => {
                            const active = size === s;
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setSize(s)}
                                    className={`rounded-xl border px-4 py-3 text-left transition ${
                                        active
                                            ? "border-accent-500 bg-accent-50 ring-2 ring-accent-300"
                                            : "border-stone-200 bg-white hover:border-stone-300"
                                    }`}
                                >
                                    <div className="flex items-baseline justify-between">
                                        <span className="font-bold">
                                            {s === "M" ? "Media" : "Grande"}
                                        </span>
                                        <span className="text-sm font-extrabold text-accent-600">
                                            {item.prezzi[s].toFixed(2)} €
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </Section>
            )}

            <Section titolo="Temperatura">
                <div className="grid grid-cols-2 gap-2">
                    {TEMPERATURE.map((t) => {
                        const active = temperatura === t.id;
                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setTemperatura(t.id)}
                                className={`rounded-xl border px-4 py-3 font-medium transition ${
                                    active
                                        ? "border-accent-500 bg-accent-50 ring-2 ring-accent-300"
                                        : "border-stone-200 bg-white hover:border-stone-300"
                                }`}
                            >
                                {t.label}
                            </button>
                        );
                    })}
                </div>
            </Section>

            <Section titolo="Toppings">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {BOBA_TOPPING.singoli.map((t) => {
                        const active = singoli.includes(t.nome);
                        return (
                            <button
                                key={t.nome}
                                type="button"
                                onClick={() => toggleSingolo(t.nome)}
                                className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-medium transition ${
                                    active
                                        ? "border-accent-500 bg-accent-50 text-accent-900"
                                        : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
                                }`}
                            >
                                <span>{t.nome}</span>
                                <span className="text-xs text-stone-500">
                                    +{t.prezzo.toFixed(2)} €
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-4 space-y-3">
                    {BOBA_TOPPING.gruppi.map((g) => (
                        <div key={g.nome}>
                            <label className="flex items-baseline justify-between text-sm font-semibold text-stone-700">
                                <span>
                                    {g.nome}{" "}
                                    <span className="text-xs font-normal text-stone-500">
                                        +{g.prezzo.toFixed(2)} €
                                    </span>
                                </span>
                            </label>
                            <select
                                value={gruppi[g.nome] ?? ""}
                                onChange={(e) => setGruppo(g.nome, e.target.value)}
                                className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 focus:border-accent-400 focus:outline-none"
                            >
                                <option value="">Nessuno</option>
                                {g.gusti.map((gusto) => (
                                    <option key={gusto} value={gusto}>
                                        {gusto}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            </Section>
        </ModalShell>
    );
}

function Section({ titolo, children }) {
    return (
        <div className="mb-6">
            <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-stone-500">
                {titolo}
            </div>
            {children}
        </div>
    );
}
