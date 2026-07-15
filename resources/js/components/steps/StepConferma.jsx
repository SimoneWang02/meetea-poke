import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../lib/api';
import { clearCart, writeConfirmedOrder } from '../../lib/cartStorage';

function itemSubtotale(item) {
    return (item.prezzo_base ?? 0) * (item.quantita ?? 1);
}

export default function StepConferma({ items, cliente, onReset }) {
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState('');
    const fired = useRef(false);
    const navigate = useNavigate();

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
                clearCart();
                writeConfirmedOrder(data, items, cliente.note);
                navigate('/ordina/conferma', { replace: true });
            } catch (e) {
                const msg =
                    e?.response?.data?.message ||
                    e?.response?.data?.errors?.[Object.keys(e?.response?.data?.errors || {})[0]]?.[0] ||
                    'Impossibile inviare l\'ordine. Riprova fra poco.';
                setError(msg);
                setStatus('error');
            }
        })();
    }, [items, cliente, navigate]);

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
        <div className="flex flex-col items-center py-16 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-mint-200 border-t-mint-600" />
            <p className="mt-6 text-lg font-medium text-stone-700">
                Sto inviando il tuo ordine...
            </p>
        </div>
    );
}
