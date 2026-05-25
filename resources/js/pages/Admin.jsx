import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { staffLogin, listOrders, updateStato } from '../lib/api';
import { beepNewOrder } from '../lib/beep';
import OrdineCard from '../components/admin/OrdineCard';

const POLL_MS = 10_000;

function Login({ onSuccess }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { token } = await staffLogin(password);
            onSuccess(token);
        } catch (err) {
            setError(err?.response?.data?.message || 'Password errata');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-stone-900 px-6">
            <form
                onSubmit={submit}
                className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl"
            >
                <div className="text-center">
                    <div className="text-2xl font-extrabold tracking-tight">
                        MeeTea<span className="text-accent-400">&amp;</span>Poke
                    </div>
                    <div className="mt-1 text-sm font-semibold uppercase tracking-wider text-stone-500">
                        Pannello staff
                    </div>
                </div>

                <label className="mt-8 block text-sm font-semibold text-stone-700">
                    Password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                />

                {error && (
                    <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full rounded-xl bg-mint-600 px-4 py-3 font-semibold text-white transition hover:bg-mint-700 disabled:bg-stone-300"
                >
                    {loading ? 'Accesso...' : 'Entra'}
                </button>

                <Link
                    to="/"
                    className="mt-4 block text-center text-sm text-stone-500 hover:text-stone-700"
                >
                    ← Torna al sito
                </Link>
            </form>
        </div>
    );
}

function Dashboard({ token, onLogout }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const seenIds = useRef(new Set());
    const isFirstLoad = useRef(true);

    const fetch = async () => {
        try {
            const data = await listOrders(token);

            if (isFirstLoad.current) {
                data.forEach((o) => seenIds.current.add(o.id));
                isFirstLoad.current = false;
            } else {
                const hasNew = data.some((o) => !seenIds.current.has(o.id));
                if (hasNew) beepNewOrder();
                data.forEach((o) => seenIds.current.add(o.id));
            }

            setOrders(data);
            setError('');
        } catch (err) {
            if (err?.response?.status === 401) {
                onLogout();
                return;
            }
            setError('Errore nel caricamento ordini');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch();
        const id = setInterval(fetch, POLL_MS);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const advance = async (orderId, stato) => {
        try {
            const updated = await updateStato(token, orderId, stato);
            setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
        } catch (err) {
            setError('Errore nell\'aggiornamento dell\'ordine');
        }
    };

    const oggi = new Date().toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    return (
        <div className="min-h-screen bg-stone-100 font-sans">
            <header className="bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div>
                        <div className="text-xl font-extrabold tracking-tight">
                            MeeTea<span className="text-accent-400">&amp;</span>Poke · staff
                        </div>
                        <div className="text-sm text-stone-500 capitalize">
                            {oggi} · {orders.length} ordin{orders.length === 1 ? 'e' : 'i'}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onLogout}
                        className="text-sm font-medium text-stone-500 hover:text-stone-700"
                    >
                        Esci
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-6">
                {error && (
                    <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="py-12 text-center text-stone-500">
                        Caricamento ordini...
                    </div>
                ) : orders.length === 0 ? (
                    <div className="rounded-3xl bg-white py-16 text-center ring-1 ring-stone-200">
                        <div className="text-5xl">🍃</div>
                        <p className="mt-4 text-lg font-medium text-stone-700">
                            Nessun ordine per oggi
                        </p>
                        <p className="text-sm text-stone-500">
                            Gli ordini compariranno qui automaticamente
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {orders.map((o) => (
                            <OrdineCard key={o.id} order={o} onAdvance={advance} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function Admin() {
    const [token, setToken] = useState(null);

    if (!token) {
        return <Login onSuccess={setToken} />;
    }

    return <Dashboard token={token} onLogout={() => setToken(null)} />;
}
