import React, { useState, useEffect } from 'react';
import { generateSlotsRitiro, CONTATTI } from '../../lib/options';
import { getSlotCounts } from '../../lib/api';

const MAX_PER_SLOT = 5;
const MIN_ANTICIPO_MINUTI = 15;

export default function StepDatiCliente({ cliente, onChange, onIndietro, onProcedi }) {
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [slotCounts, setSlotCounts] = useState({});

    useEffect(() => {
        getSlotCounts().then(setSlotCounts).catch(() => {});
    }, []);

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const slots = generateSlotsRitiro().filter((s) => {
        const [h, m] = s.split(':').map(Number);
        const slotMinutes = h * 60 + m;
        if (slotMinutes < nowMinutes + MIN_ANTICIPO_MINUTI) return false;
        if ((slotCounts[s] ?? 0) >= MAX_PER_SLOT) return false;
        return true;
    });

    const submit = () => {
        if (!cliente.nome.trim() || !cliente.telefono.trim() || !cliente.orario_ritiro) {
            setError('Compila nome, telefono e orario di ritiro.');
            return;
        }
        const [h, m] = cliente.orario_ritiro.split(':').map(Number);
        const now = new Date();
        const slotMinutes = h * 60 + m;
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        if (slotMinutes < nowMinutes + MIN_ANTICIPO_MINUTI) {
            onChange({ ...cliente, orario_ritiro: '' });
            setError('Orario non più disponibile. Scegli un nuovo orario.');
            return;
        }
        setSubmitted(true);
        onProcedi();
    };

    const set = (key, value) => onChange({ ...cliente, [key]: value });

    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight">I tuoi dati</h2>
            <p className="mt-1 text-stone-600">
                Servono per il ritiro e per contattarti se necessario.
            </p>

            <div className="mt-6 space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-stone-700">
                        Nome <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={cliente.nome}
                        onChange={(e) => set('nome', e.target.value)}
                        placeholder="Mario Rossi"
                        className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-stone-700">
                        Telefono <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        inputMode="tel"
                        value={cliente.telefono}
                        onChange={(e) => set('telefono', e.target.value)}
                        placeholder="333 1234567"
                        className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-stone-700">
                        Orario di ritiro <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={cliente.orario_ritiro}
                        onChange={(e) => set('orario_ritiro', e.target.value)}
                        className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                    >
                        <option value="">Seleziona un orario</option>
                        {slots.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-stone-700">
                        Note
                    </label>
                    <textarea
                        value={cliente.note}
                        onChange={(e) => set('note', e.target.value)}
                        placeholder="Allergie, preferenze, richieste speciali..."
                        rows={3}
                        className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                    />
                </div>
            </div>

            <div className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
                In caso di annullamento o modifiche all'ordine, chiamaci al{' '}
                <a href={`tel:${CONTATTI.telefonoTel}`} className="font-semibold underline hover:text-amber-900">
                    {CONTATTI.telefono}
                </a>
                .
            </div>

            {error && (
                <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
                    {error}
                </div>
            )}

            <p className="mt-8 text-xs text-stone-400">
                Continuando accetti il trattamento dei tuoi dati per la gestione dell'ordine.{" "}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-600">
                    Privacy policy
                </a>
            </p>

            <div className="mt-3 flex gap-3">
                <button
                    type="button"
                    onClick={onIndietro}
                    className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 font-semibold text-stone-700 transition hover:bg-stone-50"
                >
                    Indietro
                </button>
                <button
                    type="button"
                    onClick={submit}
                    disabled={submitted}
                    className="flex-[2] rounded-xl bg-mint-600 px-4 py-3 font-semibold text-white transition hover:bg-mint-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span className="flex items-center justify-center gap-2">
                        {submitted ? 'Invio in corso...' : 'Conferma Ordine'}
                        {!submitted && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M13 6l6 6-6 6"/>
                            </svg>
                        )}
                    </span>
                </button>
            </div>
        </div>
    );
}
