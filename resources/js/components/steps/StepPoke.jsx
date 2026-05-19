import React, { useState } from 'react';
import {
    POKE_BASI,
    POKE_PROTEINE,
    POKE_TOPPING,
    POKE_SALSE,
    POKE_MAX_TOPPING,
} from '../../lib/options';

function Radio({ name, value, current, onChange, label }) {
    const active = current === value;
    return (
        <label
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                active
                    ? 'border-mint-500 bg-mint-50 ring-2 ring-mint-300'
                    : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
        >
            <input
                type="radio"
                name={name}
                value={value}
                checked={active}
                onChange={() => onChange(value)}
                className="accent-mint-600"
            />
            <span className="font-medium capitalize">{label}</span>
        </label>
    );
}

export default function StepPoke({ onCancel, onAdd }) {
    const [base, setBase] = useState('');
    const [proteina, setProteina] = useState('');
    const [topping, setTopping] = useState([]);
    const [salsa, setSalsa] = useState('');
    const [quantita, setQuantita] = useState(1);
    const [error, setError] = useState('');

    const toggleTopping = (t) => {
        if (topping.includes(t)) {
            setTopping(topping.filter((x) => x !== t));
        } else {
            if (topping.length >= POKE_MAX_TOPPING) return;
            setTopping([...topping, t]);
        }
    };

    const submit = () => {
        if (!base || !proteina || !salsa) {
            setError('Compila base, proteina e salsa.');
            return;
        }
        if (topping.length === 0) {
            setError('Scegli almeno un topping.');
            return;
        }
        onAdd({
            tipo: 'poke',
            quantita,
            configurazione: { base, proteina, topping, salsa },
        });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight">🥗 Componi la tua poke bowl</h2>

            <div className="mt-6 space-y-6">
                <div>
                    <div className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                        Base
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                        {POKE_BASI.map((b) => (
                            <Radio key={b} name="base" value={b} current={base} onChange={setBase} label={b} />
                        ))}
                    </div>
                </div>

                <div>
                    <div className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                        Proteina
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-4">
                        {POKE_PROTEINE.map((p) => (
                            <Radio key={p} name="proteina" value={p} current={proteina} onChange={setProteina} label={p} />
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex items-baseline justify-between">
                        <div className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                            Topping (max {POKE_MAX_TOPPING})
                        </div>
                        <div className="text-sm text-stone-500">
                            {topping.length}/{POKE_MAX_TOPPING}
                        </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {POKE_TOPPING.map((t) => {
                            const active = topping.includes(t);
                            const disabled = !active && topping.length >= POKE_MAX_TOPPING;
                            return (
                                <button
                                    key={t}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => toggleTopping(t)}
                                    className={`rounded-xl border px-3 py-2 text-sm font-medium capitalize transition ${
                                        active
                                            ? 'border-mint-500 bg-mint-100 text-mint-900'
                                            : disabled
                                            ? 'border-stone-200 bg-stone-50 text-stone-300'
                                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                                    }`}
                                >
                                    {t}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <div className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                        Salsa
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-4">
                        {POKE_SALSE.map((s) => (
                            <Radio key={s} name="salsa" value={s} current={salsa} onChange={setSalsa} label={s} />
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
                    className="flex-[2] rounded-xl bg-mint-600 px-4 py-3 font-semibold text-white transition hover:bg-mint-700"
                >
                    Aggiungi al carrello
                </button>
            </div>
        </div>
    );
}
