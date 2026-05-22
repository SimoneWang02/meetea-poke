import React, { useMemo, useState } from "react";
import { BOBA_TOPPING } from "../../lib/options";
import ModalShell from "./ModalShell";

const TEMPERATURE = [
    { id: "fredda", label: "Fredda" },
    { id: "calda", label: "Calda" },
];

const TOPPING_INCLUSO = 0.5;

export default function BobaModal({ open, item, categoria, onClose, onAdd }) {
    const availableSizes = useMemo(
        () => (item ? Object.keys(item.prezzi) : []),
        [item],
    );

    const [size, setSize] = useState(availableSizes[0] ?? "G");
    const [temperatura, setTemperatura] = useState("fredda");
    const [singoli, setSingoli] = useState([]);
    const [gruppi, setGruppi] = useState({}); // { Gelatine: ["Mela", "Litchi"], ... }
    const [quantita, setQuantita] = useState(1);

    if (!item) return null;

    const toggleSingolo = (nome) => {
        setSingoli((prev) =>
            prev.includes(nome)
                ? prev.filter((n) => n !== nome)
                : [...prev, nome],
        );
    };

    const toggleGruppo = (gruppoNome, gusto) => {
        setGruppi((prev) => {
            const current = prev[gruppoNome] ?? [];
            const next = current.includes(gusto)
                ? current.filter((g) => g !== gusto)
                : [...current, gusto];
            if (next.length === 0) {
                const { [gruppoNome]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [gruppoNome]: next };
        });
    };

    const toppingsArr = [
        ...BOBA_TOPPING.singoli
            .filter((t) => singoli.includes(t.nome))
            .map((t) => ({ nome: t.nome, prezzo: t.prezzo })),
        ...BOBA_TOPPING.gruppi.flatMap((g) =>
            (gruppi[g.nome] ?? []).map((gusto) => ({
                nome: g.nome,
                gusto,
                prezzo: g.prezzo,
            })),
        ),
    ];

    const prezzoBase = item.prezzi[size] ?? 0;
    const prezzoToppingsLordo = toppingsArr.reduce((s, t) => s + t.prezzo, 0);
    const prezzoToppings = Math.max(0, prezzoToppingsLordo - TOPPING_INCLUSO);
    const totale = (prezzoBase + prezzoToppings) * quantita;

    const submit = () => {
        onAdd({
            tipo: "bubbletea",
            nome: item.nome,
            categoria,
            prezzo_base: prezzoBase + prezzoToppings,
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
                className="flex-1 rounded-xl bg-mint-600 px-4 py-3 font-semibold text-white transition hover:bg-mint-700"
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
                                            ? "border-mint-500 bg-mint-50 ring-2 ring-mint-300"
                                            : "border-stone-200 bg-white hover:border-stone-300"
                                    }`}
                                >
                                    <div className="flex items-baseline justify-between">
                                        <span className="font-bold">
                                            {s === "M" ? "Media" : "Grande"}
                                        </span>
                                        <span className="text-sm font-extrabold text-mint-700">
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
                                        ? "border-mint-500 bg-mint-50 ring-2 ring-mint-300"
                                        : "border-stone-200 bg-white hover:border-stone-300"
                                }`}
                            >
                                {t.label}
                            </button>
                        );
                    })}
                </div>
            </Section>

            <Section
                titolo="Toppings"
                badge={
                    <span className="inline-flex items-center rounded-full bg-accent-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                        1 topping da 0,50€ incluso
                    </span>
                }
            >
                <ul className="divide-y divide-stone-100">
                    {BOBA_TOPPING.singoli.map((t) => {
                        const isChecked = singoli.includes(t.nome);
                        return (
                            <li key={t.nome}>
                                <label className="flex cursor-pointer items-center gap-3 py-2.5">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => toggleSingolo(t.nome)}
                                        className="h-4 w-4 accent-mint-600"
                                    />
                                    <span className="text-sm text-stone-700">
                                        {t.nome}
                                    </span>
                                    <span className="text-xs text-stone-500">
                                        {t.prezzo.toFixed(2)} €
                                    </span>
                                </label>
                            </li>
                        );
                    })}

                    {BOBA_TOPPING.gruppi.map((g) => (
                        <li key={g.nome}>
                            <div className="py-2.5">
                                <div className="mb-1.5 flex items-baseline gap-2">
                                    <span className="text-sm font-semibold text-stone-700">
                                        {g.nome}
                                    </span>
                                    <span className="text-xs text-stone-500">
                                        {g.prezzo.toFixed(2)} €
                                    </span>
                                </div>
                                <ul className="divide-y divide-stone-50 pl-1">
                                    {g.gusti.map((gusto) => {
                                        const isChecked = (
                                            gruppi[g.nome] ?? []
                                        ).includes(gusto);
                                        return (
                                            <li key={gusto}>
                                                <label className="flex cursor-pointer items-center gap-3 py-1.5">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() =>
                                                            toggleGruppo(
                                                                g.nome,
                                                                gusto,
                                                            )
                                                        }
                                                        className="h-4 w-4 accent-mint-600"
                                                    />
                                                    <span className="text-sm text-stone-600">
                                                        {gusto}
                                                    </span>
                                                </label>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            </Section>
        </ModalShell>
    );
}

function Section({ titolo, badge, children }) {
    return (
        <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                    {titolo}
                </span>
                {badge}
            </div>
            {children}
        </div>
    );
}
