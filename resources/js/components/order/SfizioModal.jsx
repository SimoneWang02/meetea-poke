import React, { useEffect, useState } from "react";
import ModalShell from "./ModalShell";
import MultiSelect from "./MultiSelect";
import { formatPrezzo } from "../../lib/format";

function buildGustiMap(gusti) {
    if (!gusti?.length) return {};
    return gusti.reduce((acc, g) => ({ ...acc, [g]: (acc[g] ?? 0) + 1 }), {});
}

function flattenGustiMap(map) {
    return Object.entries(map).flatMap(([g, q]) => Array(q).fill(g));
}

export default function SfizioModal({
    open,
    sfizio,
    onClose,
    onAdd,
    initialConfig,
    initialQuantita = 1,
}) {
    const gusti = sfizio?.gusti ?? [];
    const hasGusti = gusti.length > 0;

    const [opzioneIdx, setOpzioneIdx] = useState(() => {
        if (!initialConfig?.porzione || !sfizio) return 0;
        const idx = sfizio.opzioni.findIndex(
            (op) => op.qty === initialConfig.porzione,
        );
        return idx >= 0 ? idx : 0;
    });
    const [quantita, setQuantita] = useState(initialQuantita);
    const [gusto, setGusto] = useState(
        () => initialConfig?.gusto ?? gusti[0] ?? "",
    );
    const [gustiMap, setGustiMap] = useState(() =>
        buildGustiMap(initialConfig?.gusti),
    );
    const [error, setError] = useState(null);

    if (!sfizio) return null;

    const opzione = sfizio.opzioni[opzioneIdx];
    const isMix = opzione?.mix_gusti ?? false;
    const numPz = isMix ? (opzione?.num_pz ?? 1) : 0;
    const totalGusti = Object.values(gustiMap).reduce((s, q) => s + q, 0);
    const totale = (opzione?.prezzo ?? 0) * quantita;

    const handleOpzioneChange = (idx) => {
        setOpzioneIdx(idx);
        setGustiMap({});
        setError(null);
    };

    const incrementGusto = (g) => {
        if (totalGusti >= numPz) return;
        setGustiMap((prev) => ({ ...prev, [g]: (prev[g] ?? 0) + 1 }));
        setError(null);
    };

    const decrementGusto = (g) => {
        setGustiMap((prev) => {
            if (!prev[g]) return prev;
            const next = { ...prev };
            if (next[g] <= 1) delete next[g]; else next[g]--;
            return next;
        });
    };

    const submit = () => {
        if (isMix && totalGusti < numPz) {
            setError(`Scegli ${numPz} gusti (${totalGusti}/${numPz} selezionati)`);
            return;
        }
        onAdd({
            tipo: "sfizio",
            nome: sfizio.nome,
            image: sfizio.image,
            prezzo_base: opzione.prezzo,
            quantita,
            configurazione: {
                nome: sfizio.nome,
                porzione: opzione.qty,
                ...(isMix
                    ? { gusti: flattenGustiMap(gustiMap) }
                    : hasGusti
                    ? { gusto }
                    : {}),
            },
        });
    };

    const footer = (
        <div className="flex flex-col gap-2">
            {error && (
                <p className="text-center text-sm font-medium text-red-500">
                    {error}
                </p>
            )}
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
        </div>
    );

    return (
        <ModalShell
            open={open}
            onClose={onClose}
            title={sfizio.nome}
            footer={footer}
        >
            {hasGusti && (
                <div className="mb-4">
                    {isMix ? (
                        <MultiSelect
                            titolo="Gusti"
                            items={gusti}
                            qtyMap={gustiMap}
                            onIncrement={incrementGusto}
                            onDecrement={decrementGusto}
                            maxIncluso={numPz}
                        />
                    ) : (
                        <>
                            <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-stone-500">
                                Gusto
                            </div>
                            <ul className="divide-y divide-stone-100">
                                {gusti.map((g) => (
                                    <li key={g}>
                                        <label className="flex cursor-pointer items-center gap-3 py-2.5">
                                            <input
                                                type="radio"
                                                name="gusto"
                                                value={g}
                                                checked={gusto === g}
                                                onChange={() => setGusto(g)}
                                                required
                                                className="h-4 w-4 accent-mint-600"
                                            />
                                            <span className="text-sm text-stone-700">{g}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            )}
            <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-stone-500">
                Porzione
            </div>
            <div className="grid grid-cols-1 gap-2">
                {sfizio.opzioni.map((op, idx) => {
                    const active = opzioneIdx === idx;
                    return (
                        <button
                            key={op.qty}
                            type="button"
                            onClick={() => handleOpzioneChange(idx)}
                            className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                                active
                                    ? "border-mint-500 bg-mint-50 ring-2 ring-mint-300"
                                    : "border-stone-200 bg-white hover:border-stone-300"
                            }`}
                        >
                            <span className="font-medium">{op.qty}</span>
                            <span className="font-extrabold text-mint-700">
                                {formatPrezzo(op.prezzo)}
                            </span>
                        </button>
                    );
                })}
            </div>
        </ModalShell>
    );
}
