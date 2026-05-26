import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { staffLogin, listOrders, updateStato } from "../lib/api";
import { beepNewOrder } from "../lib/beep";
import OrdineCard from "../components/admin/OrdineCard";

const POLL_MS = 10_000;

function Login({ onSuccess }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { token } = await staffLogin(password);
            onSuccess(token);
        } catch (err) {
            setError(err?.response?.data?.message || "Password errata");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-stone-900 px-6">
            <form
                onSubmit={submit}
                className="w-full max-w-sm bg-stone-50 p-8 shadow-xl font-mono border border-stone-200"
            >
                <div className="text-center border-b border-dashed border-stone-300 pb-4">
                    <div className="text-lg font-black tracking-tight">
                        MeeTea&amp;Poke
                    </div>
                    <div className="mt-0.5 text-xs font-bold uppercase tracking-widest text-stone-500">
                        Pannello staff
                    </div>
                </div>

                <label className="mt-6 block text-xs font-bold uppercase tracking-widest text-stone-600">
                    Password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    className="mt-1 w-full border border-stone-300 bg-white px-3 py-2 text-base font-mono outline-none transition focus:border-stone-500 focus:ring-1 focus:ring-stone-300"
                />

                {error && (
                    <div className="mt-3 border border-red-300 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-5 w-full border-2 border-stone-800 px-4 py-2.5 text-sm font-black tracking-wide text-stone-800 transition hover:bg-stone-800 hover:text-white disabled:border-stone-300 disabled:text-stone-400"
                >
                    {loading ? "Accesso..." : "Entra"}
                </button>

                <div className="mt-4 border-t border-dashed border-stone-300 pt-3">
                    <Link
                        to="/"
                        className="block text-center text-xs text-stone-400 hover:text-stone-600"
                    >
                        torna al sito
                    </Link>
                </div>
            </form>
        </div>
    );
}

function Dashboard({ token, onLogout }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
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
            setError("");
        } catch (err) {
            if (err?.response?.status === 401) {
                onLogout();
                return;
            }
            setError("Errore nel caricamento ordini");
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
            setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? updated : o)),
            );
        } catch (err) {
            setError("Errore nell'aggiornamento dell'ordine");
        }
    };

    const oggi = new Date().toLocaleDateString("it-IT", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    return (
        <div className="min-h-screen bg-stone-900 font-mono">
            <header className="bg-stone-950 border-b border-stone-700">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
                    <div>
                        <div className="text-base font-black tracking-tight text-stone-100">
                            MeeTea&Poke - Staff
                        </div>
                        <div className="text-xs text-stone-400 capitalize">
                            {oggi} - {orders.length} Ordin
                            {orders.length === 1 ? "e" : "i"}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onLogout}
                        className="text-xs font-bold tracking-widest text-stone-400 hover:text-stone-200 border border-stone-600 px-3 py-1.5"
                    >
                        ESCI
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-6">
                {error && (
                    <div className="mb-4 border border-red-400 bg-red-950 px-4 py-3 text-xs font-bold text-red-300">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="py-12 text-center text-sm text-stone-500">
                        Caricamento ordini...
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-stone-800 border border-stone-700 py-16 text-center">
                        <p className="text-sm font-bold text-stone-400 tracking-widest uppercase">
                            Nessun ordine per oggi
                        </p>
                        <p className="mt-1 text-xs text-stone-600">
                            Gli ordini compariranno qui automaticamente
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {orders.map((o) => (
                            <OrdineCard
                                key={o.id}
                                order={o}
                                onAdvance={advance}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function Admin() {
    const [token, setToken] = useState(() => localStorage.getItem('staff_token'));

    const handleLogin = (t) => {
        localStorage.setItem('staff_token', t);
        setToken(t);
    };

    const handleLogout = () => {
        localStorage.removeItem('staff_token');
        setToken(null);
    };

    if (!token) {
        return <Login onSuccess={handleLogin} />;
    }

    return <Dashboard token={token} onLogout={handleLogout} />;
}
