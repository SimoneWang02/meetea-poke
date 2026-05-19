import React, { useState } from 'react';
import {
    TEA_BASI,
    TEA_LATTE,
    TEA_PEARLS,
    TEA_DOLCEZZA,
    TEA_GHIACCIO,
} from '../../lib/options';

function Radio({ name, value, current, onChange, label }) {
    const active = current === value;
    return (
        <label
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                active
                    ? 'border-accent-500 bg-accent-50 ring-2 ring-accent-300'
                    : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
        >
            <input
                type="radio"
                name={name}
                value={value}
                checked={active}
                onChange={() => onChange(value)}
                className="accent-accent-500"
            />
            <span className="font-medium">{label}</span>
        </label>
    );
}

export default function StepBubbleTea({ onCancel, onAdd }) {
    const [tea, setTea] = useState('');
    const [latte, setLatte] = useState('');
    const [pearls, setPearls] = useState('');
    const [dolcezza, setDolcezza] = useState('');
    const [ghiaccio, setGhiaccio] = useState('');
    const [quantita, setQuantita] = useState(1);
    const [error, setError] = useState('');

    const submit = () => {
        if (!tea || !latte || !pearls || !dolcezza || !ghiaccio) {
            setError('Compila tutti i campi.');
            return;
        }
        onAdd({
            tipo: 'bubbletea',
            quantita,
            configurazione: { tea, latte, pearls, dolcezza, ghiaccio },
        });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight">🧋 Crea il tuo bubble tea</h2>

            <div className="mt-6 space-y-6">
                <div>
                    <div className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                        Tea base
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-4">
                        {TEA_BASI.map((t) => (
                            <Radio key={t} name="tea" value={t} current={tea} onChange={setTea} label={t} />
                        ))}
                    </div>
                </div>

                <div>
                    <div className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                        Latte
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {TEA_LATTE.map((l) => (
                            <Radio key={l} name="latte" value={l} current={latte} onChange={setLatte} label={l} />
                        ))}
                    </div>
                </div>

                <div>
                    <div className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                        Pearls
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                        {TEA_PEARLS.map((p) => (
                            <Radio key={p} name="pearls" value={p} current={pearls} onChange={setPearls} label={p} />
                        ))}
                    </div>
                </div>

                <div>
                    <div className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                        Dolcezza
                    </div>
                    <div className="mt-2 grid grid-cols-5 gap-2">
                        {TEA_DOLCEZZA.map((d) => (
                            <Radio key={d} name="dolcezza" value={d} current={dolcezza} onChange={setDolcezza} label={d} />
                        ))}
                    </div>
                </div>

                <div>
                    <div className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                        Ghiaccio
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-4">
                        {TEA_GHIACCIO.map((g) => (
                            <Radio key={g} name="ghiaccio" value={g} current={ghiaccio} onChange={setGhiaccio} label={g} />
                        ))}
                    </div>
                </div>

                <div>
                    <div className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                        Quantità
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setQuantita(Math.max(1, quantita - 1))}
                            className="h-12 w-12 rounded-xl border border-stone-200 bg-white text-xl font-bold text-stone-700 transition hover:bg-stone-50"
                        >
                            −
                        </button>
                        <span className="w-12 text-center text-2xl font-bold">{quantita}</span>
                        <button
                            type="button"
                            onClick={() => setQuantita(Math.min(10, quantita + 1))}
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
                    className="flex-[2] rounded-xl bg-accent-500 px-4 py-3 font-semibold text-white transition hover:bg-accent-600"
                >
                    Aggiungi al carrello
                </button>
            </div>
        </div>
    );
}
