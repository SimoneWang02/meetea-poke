import React, { useState, useEffect, useMemo } from "react";
import { formatPrezzo } from "../../lib/format";
import { useMenu } from "../../lib/MenuProvider";
import ModalShell from "./ModalShell";
import MultiSelect from "./MultiSelect";

const arrayToQtyMap = (arr = []) =>
    arr.reduce((m, x) => ({ ...m, [x]: (m[x] ?? 0) + 1 }), {});

const totalQty = (map) => Object.values(map).reduce((s, q) => s + q, 0);

const flattenMap = (map) =>
    Object.entries(map).flatMap(([nome, qty]) => Array(qty).fill(nome));

const POSATE = ["Cucchiaio", "Bacchette", "Forchetta", "Senza Posate"];

function ExtraList({ items, extraQty, setExtraQty }) {
    return (
        <ul className="divide-y divide-stone-100">
            {items.map(({ nome, prezzo }) => {
                const qty = extraQty[nome] ?? 0;
                return (
                    <li key={nome} className="flex items-center gap-3 py-2.5">
                        {qty === 0 ? (
                            <button
                                type="button"
                                onClick={() =>
                                    setExtraQty({ ...extraQty, [nome]: 1 })
                                }
                                aria-label={`Aggiungi extra ${nome}`}
                                className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-mint-500 text-base font-bold text-mint-600 transition hover:bg-mint-50"
                            >
                                +
                            </button>
                        ) : (
                            <div className="flex shrink-0 items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const next = { ...extraQty };
                                        if (next[nome] <= 1) delete next[nome];
                                        else next[nome]--;
                                        setExtraQty(next);
                                    }}
                                    aria-label={`Rimuovi extra ${nome}`}
                                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-red-300 text-base font-bold text-red-500 transition hover:bg-red-50"
                                >
                                    −
                                </button>
                                <span className="w-5 text-center text-sm font-semibold text-stone-800">
                                    {qty}
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setExtraQty({
                                            ...extraQty,
                                            [nome]: (extraQty[nome] ?? 0) + 1,
                                        })
                                    }
                                    aria-label={`Aggiungi extra ${nome}`}
                                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-mint-500 text-base font-bold text-mint-600 transition hover:bg-mint-50"
                                >
                                    +
                                </button>
                            </div>
                        )}
                        <span className="flex-1 text-sm text-stone-700">
                            {nome}
                        </span>
                        <span className="text-sm font-bold text-mint-700">
                            +{formatPrezzo(prezzo)}
                        </span>
                    </li>
                );
            })}
        </ul>
    );
}

export default function PokeModal({
    open,
    dimensione,
    onClose,
    onAdd,
    initialConfig,
    initialQuantita = 1,
}) {
    const { menu } = useMenu();
    const POKE_BASI = menu?.POKE_BASI ?? [];
    const POKE_BASI_MAX = menu?.POKE_BASI_MAX ?? 2;
    const POKE_PROTEINE = menu?.POKE_PROTEINE ?? [];
    const POKE_GREEN = menu?.POKE_GREEN ?? [];
    const POKE_CRISPY = menu?.POKE_CRISPY ?? [];
    const POKE_SALSE = menu?.POKE_SALSE ?? [];
    const POKE_EXTRA_PREZZI = menu?.POKE_EXTRA_PREZZI ?? {
        proteine: 0,
        green: 0,
        crispy: 0,
        salse: 0,
    };

    const ITEM_LOOKUP = useMemo(
        () =>
            Object.fromEntries([
                ...POKE_PROTEINE.map((n) => [
                    n,
                    { cat: "proteine", prezzo: POKE_EXTRA_PREZZI.proteine },
                ]),
                ...POKE_GREEN.map((n) => [
                    n,
                    { cat: "green", prezzo: POKE_EXTRA_PREZZI.green },
                ]),
                ...POKE_CRISPY.map((n) => [
                    n,
                    { cat: "crispy", prezzo: POKE_EXTRA_PREZZI.crispy },
                ]),
                ...POKE_SALSE.map((n) => [
                    n,
                    { cat: "salse", prezzo: POKE_EXTRA_PREZZI.salse },
                ]),
            ]),
        [POKE_PROTEINE, POKE_GREEN, POKE_CRISPY, POKE_SALSE, POKE_EXTRA_PREZZI],
    );

    const EXTRA_PROTEINE_ITEMS = useMemo(
        () =>
            POKE_PROTEINE.map((n) => ({
                nome: n,
                prezzo: POKE_EXTRA_PREZZI.proteine,
            })),
        [POKE_PROTEINE, POKE_EXTRA_PREZZI],
    );
    const EXTRA_GREEN_ITEMS = useMemo(
        () =>
            POKE_GREEN.map((n) => ({
                nome: n,
                prezzo: POKE_EXTRA_PREZZI.green,
            })),
        [POKE_GREEN, POKE_EXTRA_PREZZI],
    );
    const EXTRA_CRISPY_ITEMS = useMemo(
        () =>
            POKE_CRISPY.map((n) => ({
                nome: n,
                prezzo: POKE_EXTRA_PREZZI.crispy,
            })),
        [POKE_CRISPY, POKE_EXTRA_PREZZI],
    );
    const EXTRA_SALSE_ITEMS = useMemo(
        () =>
            POKE_SALSE.map((n) => ({
                nome: n,
                prezzo: POKE_EXTRA_PREZZI.salse,
            })),
        [POKE_SALSE, POKE_EXTRA_PREZZI],
    );

    const [basi, setBasi] = useState(arrayToQtyMap(initialConfig?.basi));
    const [proteine, setProteine] = useState(
        arrayToQtyMap(initialConfig?.proteine),
    );
    const [green, setGreen] = useState(arrayToQtyMap(initialConfig?.green));
    const [crispy, setCrispy] = useState(arrayToQtyMap(initialConfig?.crispy));
    const [salse, setSalse] = useState(arrayToQtyMap(initialConfig?.salse));
    const [extraQty, setExtraQty] = useState({});
    const [salsaAParte, setSalsaAParte] = useState(
        initialConfig?.salsa_a_parte ?? false,
    );
    const [posate, setPosate] = useState(initialConfig?.posate ?? "");
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

    if (!dimensione || !menu) return null;

    const makeIncrement = (state, setState, maxHard) => (item) => {
        if (maxHard !== undefined && totalQty(state) >= maxHard) return;
        setState({ ...state, [item]: (state[item] ?? 0) + 1 });
    };

    const makeDecrement = (state, setState) => (item) => {
        if (!state[item]) return;
        const next = { ...state };
        if (next[item] <= 1) delete next[item];
        else next[item]--;
        setState(next);
    };

    const extraCost = Object.entries(extraQty).reduce(
        (s, [nome, qty]) => s + (ITEM_LOOKUP[nome]?.prezzo ?? 0) * qty,
        0,
    );

    const prezzoTotale = dimensione.prezzo + extraCost;

    const submit = () => {
        if (totalQty(basi) === 0) {
            setError("Scegli almeno una base.");
            return;
        }
        if (totalQty(proteine) === 0) {
            setError("Scegli almeno una proteina.");
            return;
        }
        if (!posate) {
            setError("Scegli le posate.");
            return;
        }

        const extras = {};
        Object.entries(extraQty).forEach(([nome, qty]) => {
            const info = ITEM_LOOKUP[nome];
            if (!info) return;
            if (!extras[info.cat]) extras[info.cat] = [];
            for (let i = 0; i < qty; i++)
                extras[info.cat].push({ nome, prezzo: info.prezzo });
        });

        onAdd({
            tipo: "poke",
            nome: `Poke Bowl ${dimensione.nome}`,
            prezzo_base: prezzoTotale,
            quantita,
            configurazione: {
                dimensione: dimensione.id,
                basi: flattenMap(basi),
                proteine: flattenMap(proteine),
                green: flattenMap(green),
                crispy: flattenMap(crispy),
                salse: flattenMap(salse),
                extras,
                salsa_a_parte: salsaAParte,
                posate,
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
                {initialConfig ? "Salva" : "Aggiungi"} -{" "}
                {formatPrezzo(prezzoTotale * quantita)}
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
                    qtyMap={basi}
                    onIncrement={makeIncrement(basi, setBasi, POKE_BASI_MAX)}
                    onDecrement={makeDecrement(basi, setBasi)}
                    maxIncluso={POKE_BASI_MAX}
                    maxHard={POKE_BASI_MAX}
                />
                <MultiSelect
                    titolo="Proteine"
                    items={POKE_PROTEINE}
                    qtyMap={proteine}
                    onIncrement={makeIncrement(proteine, setProteine)}
                    onDecrement={makeDecrement(proteine, setProteine)}
                    maxIncluso={dimensione.proteine}
                />
                <MultiSelect
                    titolo="Green & Co"
                    items={POKE_GREEN}
                    qtyMap={green}
                    onIncrement={makeIncrement(green, setGreen)}
                    onDecrement={makeDecrement(green, setGreen)}
                    maxIncluso={dimensione.green}
                />
                <MultiSelect
                    titolo="Crispy"
                    items={POKE_CRISPY}
                    qtyMap={crispy}
                    onIncrement={makeIncrement(crispy, setCrispy)}
                    onDecrement={makeDecrement(crispy, setCrispy)}
                    maxIncluso={dimensione.crispy}
                />
                <MultiSelect
                    titolo="Salse"
                    items={POKE_SALSE}
                    qtyMap={salse}
                    onIncrement={makeIncrement(salse, setSalse)}
                    onDecrement={makeDecrement(salse, setSalse)}
                    maxIncluso={dimensione.salse}
                />

                {/* Extra Proteine */}
                <div>
                    <div className="mb-1">
                        <h3 className="text-sm font-semibold text-stone-800">
                            Extra Proteine (Facoltativo)
                        </h3>
                    </div>
                    <ExtraList
                        items={EXTRA_PROTEINE_ITEMS}
                        extraQty={extraQty}
                        setExtraQty={setExtraQty}
                    />
                </div>

                {/* Extra Green */}
                <div>
                    <div className="mb-1">
                        <h3 className="text-sm font-semibold text-stone-800">
                            Extra Green (Facoltativo)
                        </h3>
                    </div>
                    <ExtraList
                        items={EXTRA_GREEN_ITEMS}
                        extraQty={extraQty}
                        setExtraQty={setExtraQty}
                    />
                </div>

                {/* Extra Crispy */}
                <div>
                    <div className="mb-1">
                        <h3 className="text-sm font-semibold text-stone-800">
                            Extra Crispy (Facoltativo)
                        </h3>
                    </div>
                    <ExtraList
                        items={EXTRA_CRISPY_ITEMS}
                        extraQty={extraQty}
                        setExtraQty={setExtraQty}
                    />
                </div>

                {/* Extra Salse */}
                <div>
                    <div className="mb-1">
                        <h3 className="text-sm font-semibold text-stone-800">
                            Extra Salse (Facoltativo)
                        </h3>
                    </div>
                    <ExtraList
                        items={EXTRA_SALSE_ITEMS}
                        extraQty={extraQty}
                        setExtraQty={setExtraQty}
                    />
                </div>

                {/* Salsa a parte */}
                <div>
                    <h3 className="mb-2 text-sm font-semibold text-stone-800">
                        Vuoi la salsa scelta a parte?
                    </h3>
                    <label className="flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            checked={salsaAParte}
                            onChange={(e) => setSalsaAParte(e.target.checked)}
                            className="h-4 w-4 accent-mint-600"
                        />
                        <span className="text-sm text-stone-700">Sì</span>
                    </label>
                </div>

                {/* Posate */}
                <div>
                    <h3 className="mb-2 text-sm font-semibold text-stone-800">
                        Posate <span className="text-red-500">*</span>
                    </h3>
                    <ul className="divide-y divide-stone-100">
                        {POSATE.map((opzione) => (
                            <li key={opzione}>
                                <label className="flex cursor-pointer items-center gap-3 py-2.5">
                                    <input
                                        type="radio"
                                        name="posate"
                                        value={opzione}
                                        checked={posate === opzione}
                                        onChange={() => setPosate(opzione)}
                                        className="h-4 w-4 accent-mint-600"
                                    />
                                    <span className="text-sm text-stone-700">
                                        {opzione}
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>

                {error && (
                    <div
                        className={`sticky bottom-0 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200 transition-all duration-300 ease-in-out ${errorVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                    >
                        {error}
                    </div>
                )}
            </div>
        </ModalShell>
    );
}
