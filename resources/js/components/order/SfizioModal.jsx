import React, { useState } from "react";
import ModalShell from "./ModalShell";
import { formatPrezzo } from "../../lib/format";

export default function SfizioModal({ open, sfizio, onClose, onAdd, initialConfig, initialQuantita = 1 }) {
    const [opzioneIdx, setOpzioneIdx] = useState(() => {
        if (!initialConfig?.porzione || !sfizio) return 0;
        const idx = sfizio.opzioni.findIndex((op) => op.qty === initialConfig.porzione);
        return idx >= 0 ? idx : 0;
    });
    const [quantita, setQuantita] = useState(initialQuantita);

    if (!sfizio) return null;

    const opzione = sfizio.opzioni[opzioneIdx];
    const totale = (opzione?.prezzo ?? 0) * quantita;

    const submit = () => {
        onAdd({
            tipo: "sfizio",
            nome: sfizio.nome,
            image: sfizio.image,
            prezzo_base: opzione.prezzo,
            quantita,
            configurazione: { porzione: opzione.qty },
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
            title={sfizio.nome}
            footer={footer}
        >
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
                            onClick={() => setOpzioneIdx(idx)}
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
