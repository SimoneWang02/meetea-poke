import React from 'react';

export default function StepTipo({ items, onChoose, onProcedi }) {
    return (
        <div>
            {items.length > 0 && (
                <div className="mb-6 rounded-2xl bg-mint-50 p-5 ring-1 ring-mint-200">
                    <div className="text-sm font-semibold uppercase tracking-wider text-mint-800">
                        Nel carrello
                    </div>
                    <ul className="mt-2 space-y-1">
                        {items.map((it, idx) => (
                            <li key={idx} className="text-sm text-stone-700">
                                {it.tipo === 'poke' ? '🥗' : '🧋'}{' '}
                                {it.tipo === 'poke' ? 'Poke Bowl' : 'Bubble Tea'} ×{it.quantita}
                            </li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        onClick={onProcedi}
                        className="mt-4 w-full rounded-xl bg-mint-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-mint-700"
                    >
                        Procedi con questi →
                    </button>
                </div>
            )}

            <h2 className="text-2xl font-bold tracking-tight">
                Cosa vuoi aggiungere?
            </h2>
            <p className="mt-1 text-stone-600">
                Scegli un articolo alla volta, potrai aggiungerne altri dopo.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={() => onChoose('poke')}
                    className="group flex flex-col items-start rounded-3xl bg-white p-8 text-left shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-mint-300"
                >
                    <span className="text-5xl">🥗</span>
                    <span className="mt-4 text-xl font-bold">Poke Bowl</span>
                    <span className="mt-1 text-sm text-stone-600">
                        Dimensione, basi, proteine, green, crispy, salse
                    </span>
                    <span className="mt-6 text-sm font-semibold text-mint-700 group-hover:text-mint-800">
                        Componi →
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => onChoose('bubbletea')}
                    className="group flex flex-col items-start rounded-3xl bg-white p-8 text-left shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-accent-300"
                >
                    <span className="text-5xl">🧋</span>
                    <span className="mt-4 text-xl font-bold">Bubble Tea</span>
                    <span className="mt-1 text-sm text-stone-600">
                        Tea, latte, pearls, dolcezza, ghiaccio
                    </span>
                    <span className="mt-6 text-sm font-semibold text-accent-500 group-hover:text-accent-600">
                        Personalizza →
                    </span>
                </button>
            </div>
        </div>
    );
}
