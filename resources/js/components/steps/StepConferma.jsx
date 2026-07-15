import React, { useEffect, useRef, useState } from 'react';
import { createOrder } from '../../lib/api';
import { formatPrezzo } from '../../lib/format';
import { ItemDetails } from './StepRiepilogo';
import { clearCart } from '../../lib/cartStorage';

function itemSubtotale(item) {
    return (item.prezzo_base ?? 0) * (item.quantita ?? 1);
}

export default function StepConferma({ items, cliente, onReset }) {
    const [status, setStatus] = useState('loading');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const fired = useRef(false);

    useEffect(() => {
        if (fired.current) return;
        fired.current = true;

        (async () => {
            try {
                const totale = items.reduce((s, it) => s + itemSubtotale(it), 0);
                const data = await createOrder({
                    nome_cliente: cliente.nome,
                    telefono: cliente.telefono,
                    orario_ritiro: cliente.orario_ritiro,
                    note: cliente.note || null,
                    totale,
                    items,
                });
                setResult(data);
                setStatus('success');
                clearCart();
            } catch (e) {
                const msg =
                    e?.response?.data?.message ||
                    e?.response?.data?.errors?.[Object.keys(e?.response?.data?.errors || {})[0]]?.[0] ||
                    'Impossibile inviare l\'ordine. Riprova fra poco.';
                setError(msg);
                setStatus('error');
            }
        })();
    }, [items, cliente]);

    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center py-16 text-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-mint-200 border-t-mint-600" />
                <p className="mt-6 text-lg font-medium text-stone-700">
                    Sto inviando il tuo ordine...
                </p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="text-center">
                <div className="text-5xl">😞</div>
                <h2 className="mt-4 text-2xl font-bold">Qualcosa è andato storto</h2>
                <p className="mt-2 text-stone-600">{error}</p>
                <button
                    type="button"
                    onClick={onReset}
                    className="mt-8 rounded-xl border border-stone-300 bg-white px-6 py-3 font-semibold text-stone-700 transition hover:bg-stone-50"
                >
                    Riprova
                </button>
            </div>
        );
    }

    return (
        <div className="text-center">
            <div className="text-6xl">🎉</div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
                Grazie {result.nome_cliente}!
            </h2>
            <p className="mt-3 text-lg text-stone-700">
                Il tuo ordine{' '}
                <span className="font-bold text-mint-700">{result.numero_ordine}</span>{' '}
                è confermato.
            </p>
            <p className="mt-1 text-lg text-stone-700">
                Passa a ritirarlo alle{' '}
                <span className="font-bold">{result.orario_ritiro}</span>.
            </p>

            <div className="mt-8 rounded-2xl bg-white p-6 text-left ring-1 ring-stone-200">
                <div className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                    Riepilogo ordine
                </div>
                <ul className="mt-3 space-y-3 divide-y divide-stone-100">
                    {items.map((item, idx) => (
                        <li key={idx} className={idx > 0 ? 'pt-3' : ''}>
                            <div className="flex items-baseline justify-between gap-3 text-sm">
                                <span className="text-stone-700">
                                    {(item.quantita ?? 1) > 1 && (
                                        <span className="font-semibold">
                                            {item.quantita}×{' '}
                                        </span>
                                    )}
                                    <span className="font-medium">{item.nome}</span>
                                </span>
                                <span className="shrink-0 font-semibold text-stone-800">
                                    {formatPrezzo(itemSubtotale(item))}
                                </span>
                            </div>
                            <ItemDetails item={item} />
                        </li>
                    ))}
                </ul>
                <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3">
                    <span className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                        Totale
                    </span>
                    <span className="text-lg font-extrabold text-mint-700">
                        {formatPrezzo(
                            items.reduce((s, it) => s + itemSubtotale(it), 0),
                        )}
                    </span>
                </div>
                {cliente.note && (
                    <div className="mt-4 border-t border-stone-100 pt-3">
                        <div className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                            Note
                        </div>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-stone-700">
                            {cliente.note}
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-6 rounded-2xl bg-mint-50 p-6 text-left ring-1 ring-mint-200">
                <div className="text-sm font-semibold uppercase tracking-wider text-mint-800">
                    Promemoria
                </div>
                <ul className="mt-2 space-y-1 text-sm text-stone-700">
                    <li>• Pagamento al ritiro in negozio</li>
                    <li>• Ti chiameremo se serve un chiarimento</li>
                </ul>
            </div>

            <button
                type="button"
                onClick={onReset}
                className="mt-8 rounded-xl bg-mint-600 px-6 py-3 font-semibold text-white transition hover:bg-mint-700"
            >
                Fai un nuovo ordine
            </button>
        </div>
    );
}
