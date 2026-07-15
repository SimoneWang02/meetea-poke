import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMenu } from "../../lib/MenuProvider";
import { scrollIntoViewSmooth } from "../../lib/scroll";
import ModalShell from "./ModalShell";
import { formatPrezzo, formatNumero } from "../../lib/format";

const TEMPERATURE = [
    { id: "fredda", label: "Fredda" },
    { id: "tiepida", label: "Tiepida" },
    { id: "calda", label: "Calda" },
];

const MAX_TOPPINGS = 2;

export default function BobaModal({
    open,
    item,
    categoria,
    onClose,
    onAdd,
    initialConfig,
    initialQuantita = 1,
}) {
    const { menu } = useMenu();
    const BOBA_TOPPING = menu?.BOBA_TOPPING ?? { singoli: [], gruppi: [] };
    const cat = menu?.BOBA_CATEGORIE?.find((c) => c.id === categoria);
    const basi = cat?.basi ?? [];

    const availableSizes = useMemo(
        () => (item ? Object.keys(item.prezzi) : []),
        [item],
    );

    const [size, setSize] = useState(
        initialConfig?.size ?? availableSizes[0] ?? "G",
    );
    const [base, setBase] = useState(initialConfig?.base ?? "");
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
    const baseRef = useRef(null);
    const temperaturaRef = useRef(null);
    const toppingsRef = useRef(null);

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

    if (!item || !menu) return null;

    const failValidation = (message, ref) => {
        setError(message);
        scrollIntoViewSmooth(ref.current);
    };

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
            .map((t) => ({ nome: t.nome })),
        ...BOBA_TOPPING.gruppi.flatMap((g) =>
            (gruppi[g.nome] ?? []).map((gusto) => ({
                nome: g.nome,
                gusto,
            })),
        ),
    ];
    const toppingsCount = toppingsArr.length;
    const maxRaggiunto = toppingsCount >= MAX_TOPPINGS;

    const prezzoBase = item.prezzi[size] ?? 0;
    const totale = prezzoBase * quantita;

    const submit = () => {
        if (basi.length > 0 && !base) {
            failValidation("Scegli la base.", baseRef);
            return;
        }
        if (!temperatura) {
            failValidation("Scegli la temperatura.", temperaturaRef);
            return;
        }
        if (toppingsCount > MAX_TOPPINGS) {
            failValidation(`Massimo ${MAX_TOPPINGS} toppings.`, toppingsRef);
            return;
        }
        onAdd({
            tipo: "bubbletea",
            nome: item.nome,
            categoria,
            prezzo_base: prezzoBase,
            quantita,
            configurazione: {
                nome: item.nome,
                size,
                ...(base ? { base } : {}),
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
                {initialConfig ? "Salva" : "Aggiungi"} - {formatPrezzo(totale)}
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

            {basi.length > 0 && (
                <Section
                    ref={baseRef}
                    titolo={
                        <>
                            Base <span className="text-red-500">*</span>
                        </>
                    }
                >
                    <ul className="divide-y divide-stone-100">
                        {basi.map((b) => (
                            <li key={b}>
                                <label className="flex cursor-pointer items-center gap-3 py-2.5">
                                    <input
                                        type="radio"
                                        name="base"
                                        value={b}
                                        checked={base === b}
                                        onChange={() => setBase(b)}
                                        className="h-4 w-4 accent-mint-600"
                                    />
                                    <span className="text-sm text-stone-700">
                                        {b}
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            <Section
                ref={temperaturaRef}
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
                ref={toppingsRef}
                titolo="Toppings"
                badge={
                    <span
                        className={`text-sm font-medium ${maxRaggiunto ? "text-mint-600" : "text-stone-400"}`}
                    >
                        {toppingsCount}/{MAX_TOPPINGS}
                    </span>
                }
            >
                <ul className="divide-y divide-stone-100">
                    {BOBA_TOPPING.singoli.map((t) => {
                        const checked = singoli.includes(t.nome);
                        const disabled = !checked && maxRaggiunto;
                        return (
                            <li key={t.nome}>
                                <label
                                    className={`flex items-center gap-3 py-2.5 ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        disabled={disabled}
                                        onChange={() => toggleSingolo(t.nome)}
                                        className="h-4 w-4 accent-mint-600"
                                    />
                                    <span className="flex-1 text-sm text-stone-700">
                                        {t.nome}
                                    </span>
                                </label>
                            </li>
                        );
                    })}
                </ul>

                {BOBA_TOPPING.gruppi.map((g) => (
                    <div key={g.nome} className="mt-4">
                        <div className="mb-1.5 flex items-baseline gap-2">
                            <span className="text-sm font-semibold text-stone-700">
                                {g.nome}
                            </span>
                        </div>
                        <ul className="divide-y divide-stone-100">
                            {g.gusti.map((gusto) => {
                                const checked = (gruppi[g.nome] ?? []).includes(
                                    gusto,
                                );
                                const disabled = !checked && maxRaggiunto;
                                return (
                                    <li key={gusto}>
                                        <label
                                            className={`flex items-center gap-3 py-2.5 ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                disabled={disabled}
                                                onChange={() =>
                                                    toggleGruppo(g.nome, gusto)
                                                }
                                                className="h-4 w-4 accent-mint-600"
                                            />
                                            <span className="flex-1 text-sm text-stone-600">
                                                {gusto}
                                            </span>
                                        </label>
                                    </li>
                                );
                            })}
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

const Section = React.forwardRef(function Section(
    { titolo, badge, children },
    ref,
) {
    return (
        <div ref={ref} className="mb-6">
            <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                    {titolo}
                </span>
                {badge}
            </div>
            {children}
        </div>
    );
});
