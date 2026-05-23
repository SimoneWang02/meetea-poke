import React, { useEffect, useMemo, useState } from "react";
import { BOBA_TOPPING } from "../../lib/options";
import ModalShell from "./ModalShell";
import { formatPrezzo, formatNumero } from "../../lib/format";

const TEMPERATURE = [
    { id: "fredda", label: "Fredda" },
    { id: "tiepida", label: "Tiepida" },
    { id: "calda", label: "Calda" },
];

const TOPPING_INCLUSO = 0.5;

export default function BobaModal({
    open,
    item,
    categoria,
    onClose,
    onAdd,
    initialConfig,
    initialQuantita = 1,
}) {
    const availableSizes = useMemo(
        () => (item ? Object.keys(item.prezzi) : []),
        [item],
    );

    const [size, setSize] = useState(
        initialConfig?.size ?? availableSizes[0] ?? "G",
    );
    const [temperatura, setTemperatura] = useState(
        initialConfig?.temperatura ?? "",
    );
    const [singoli, setSingoli] = useState(() => {
        if (!initialConfig?.toppings) return [];
        const singolNomi = new Set(BOBA_TOPPING.singoli.map((t) => t.nome));
        return initialConfig.toppings
            .filter((t) => singolNomi.has(t.nome) && !t.gusto)
            .map((t) => t.nome);
    });
    const [gruppi, setGruppi] = useState(() => {
        if (!initialConfig?.toppings) return {};
        const result = {};
        for (const t of initialConfig.toppings) {
            if (t.gusto) result[t.nome] = [...(result[t.nome] ?? []), t.gusto];
        }
        return result;
    });
    const [quantita, setQuantita] = useState(initialQuantita);
    const [error, setError] = useState("");
    const [errorVisible, setErrorVisible] = useState(false);

    useEffect(() => {
        if (!error) {
            setErrorVisible(false);
            return;
        }
        const raf = requestAnimationFrame(() => setErrorVisible(true));
        const hide = setTimeout(() => setErrorVisible(false), 5000);
        const clear = setTimeout(() => setError(""), 5300);
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(hide);
            clearTimeout(clear);
        };
    }, [error]);

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
        if (!temperatura) {
            setError("Scegli la temperatura.");
            return;
        }
        onAdd({
            tipo: "bubbletea",
            nome: item.nome,
            categoria,
            prezzo_base: prezzoBase + prezzoToppings,
            quantita,
            configurazione: { size, temperatura, toppings: toppingsArr },
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
                {initialConfig ? "Salva" : "Aggiungi"} · {formatPrezzo(totale)}
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
                    <ul className="divide-y divide-stone-100">
                        {(() => {
                            const basePrezzo =
                                item.prezzi[availableSizes[0]] ?? 0;
                            return availableSizes.map((s) => {
                                const diff = (item.prezzi[s] ?? 0) - basePrezzo;
                                return (
                                    <li key={s}>
                                        <label className="flex cursor-pointer items-center gap-3 py-2.5">
                                            <input
                                                type="radio"
                                                name="size"
                                                value={s}
                                                checked={size === s}
                                                onChange={() => setSize(s)}
                                                className="h-4 w-4 accent-mint-600"
                                            />
                                            <span className="flex-1 text-sm text-stone-700">
                                                {s === "M" ? "Media" : "Grande"}
                                            </span>
                                            {diff > 0 && (
                                                <span className="text-sm font-bold text-mint-700">
                                                    +{formatNumero(diff)} €
                                                </span>
                                            )}
                                        </label>
                                    </li>
                                );
                            });
                        })()}
                    </ul>
                </Section>
            )}

            <Section
                titolo={
                    <>
                        Temperatura <span className="text-red-500">*</span>
                    </>
                }
            >
                <ul className="divide-y divide-stone-100">
                    {TEMPERATURE.map((t) => (
                        <li key={t.id}>
                            <label className="flex cursor-pointer items-center gap-3 py-2.5">
                                <input
                                    type="radio"
                                    name="temperatura"
                                    value={t.id}
                                    checked={temperatura === t.id}
                                    onChange={() => setTemperatura(t.id)}
                                    className="h-4 w-4 accent-mint-600"
                                />
                                <span className="text-sm text-stone-700">
                                    {t.label}
                                </span>
                            </label>
                        </li>
                    ))}
                </ul>
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
                    {BOBA_TOPPING.singoli.map((t) => (
                        <li key={t.nome}>
                            <label className="flex cursor-pointer items-center gap-3 py-2.5">
                                <input
                                    type="checkbox"
                                    checked={singoli.includes(t.nome)}
                                    onChange={() => toggleSingolo(t.nome)}
                                    className="h-4 w-4 accent-mint-600"
                                />
                                <span className="flex-1 text-sm text-stone-700">
                                    {t.nome}
                                </span>
                                <span className="text-sm font-bold text-mint-700">
                                    {formatPrezzo(t.prezzo)}
                                </span>
                            </label>
                        </li>
                    ))}
                </ul>

                {BOBA_TOPPING.gruppi.map((g) => (
                    <div key={g.nome} className="mt-4">
                        <div className="mb-1.5 flex items-baseline gap-2">
                            <span className="text-sm font-semibold text-stone-700">
                                {g.nome}
                            </span>
                        </div>
                        <ul className="divide-y divide-stone-100">
                            {g.gusti.map((gusto) => (
                                <li key={gusto}>
                                    <label className="flex cursor-pointer items-center gap-3 py-2.5 ">
                                        <input
                                            type="checkbox"
                                            checked={(
                                                gruppi[g.nome] ?? []
                                            ).includes(gusto)}
                                            onChange={() =>
                                                toggleGruppo(g.nome, gusto)
                                            }
                                            className="h-4 w-4 accent-mint-600"
                                        />
                                        <span className="flex-1 text-sm text-stone-600">
                                            {gusto}
                                        </span>
                                        <span className="text-sm font-bold text-mint-700">
                                            {formatPrezzo(g.prezzo)}
                                        </span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </Section>

            {error && (
                <div
                    className={`sticky bottom-0 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200 transition-all duration-300 ease-in-out ${errorVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                >
                    {error}
                </div>
            )}
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
