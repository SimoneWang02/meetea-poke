import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { readConfirmedOrder, clearConfirmedOrder } from "../lib/cartStorage";
import { formatPrezzo } from "../lib/format";
import { ItemDetails } from "../components/steps/StepRiepilogo";

function itemSubtotale(item) {
    return (item.prezzo_base ?? 0) * (item.quantita ?? 1);
}

export default function OrdineConfermato() {
    const [confirmed] = useState(() => readConfirmedOrder());
    const navigate = useNavigate();

    if (!confirmed) {
        return <Navigate to="/ordina" replace />;
    }

    const { result, items, note } = confirmed;

    const nuovoOrdine = () => {
        clearConfirmedOrder();
        navigate("/ordina");
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans">
            <header className="sticky top-0 z-40 bg-white shadow-sm">
                <div className="mx-auto grid max-w-2xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-3">
                    <Link
                        to="/"
                        aria-label="Torna alla home"
                        className="inline-flex h-10 w-fit items-center gap-1 justify-self-start rounded-full px-3 text-stone-500 transition hover:bg-stone-100 hover:text-stone-700"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5 shrink-0"
                        >
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        <span className="text-sm font-medium">Torna Indietro</span>
                    </Link>
                    <Link to="/" className="flex justify-center">
                        <img
                            src="/images/logo.svg"
                            alt="MeeTea&Poke"
                            className="h-10 w-auto"
                        />
                    </Link>
                    <div />
                </div>
            </header>

            <main className="mx-auto max-w-2xl px-6 py-8 text-center">
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

                <div className="mx-auto mt-8 max-w-sm bg-stone-50 font-mono text-stone-800 shadow-md border border-stone-200 text-left">
                    <div className="text-center pt-4 pb-2 px-4">
                        <div className="text-base font-black tracking-tight">MeeTea&amp;Poke</div>
                        <div className="text-4xl font-black tracking-tight leading-none mt-1">
                            #{String(result.numero_ordine).padStart(3, '0')}
                        </div>
                    </div>

                    <div className="border-t border-dashed border-stone-300 my-2" />

                    <div className="px-4 text-sm">
                        <span className="font-bold">Ritiro:</span> {result.orario_ritiro}
                    </div>

                    {note && (
                        <>
                            <div className="border-t border-dashed border-stone-300 my-2" />
                            <div className="px-4 text-sm">
                                <span className="font-bold">Note:</span> {note}
                            </div>
                        </>
                    )}

                    <div className="border-t border-dashed border-stone-300 my-2" />

                    <div className="px-4 space-y-2">
                        {items.map((item, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between font-bold text-sm">
                                    <span>{item.quantita ?? 1}x {item.nome}</span>
                                    <span>{formatPrezzo(itemSubtotale(item))}</span>
                                </div>
                                <ItemDetails
                                    item={item}
                                    className="mt-0.5 space-y-0.5 text-xs text-stone-600 pl-3"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-dashed border-stone-300 my-2" />

                    <div className="px-4 pb-4 flex justify-between font-black text-sm">
                        <span>TOTALE</span>
                        <span>
                            {formatPrezzo(
                                items.reduce((s, it) => s + itemSubtotale(it), 0),
                            )}
                        </span>
                    </div>
                </div>

                <div className="mt-8 rounded-2xl bg-mint-50 p-6 text-left ring-1 ring-mint-200">
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
                    onClick={nuovoOrdine}
                    className="mt-8 rounded-xl bg-mint-600 px-6 py-3 font-semibold text-white transition hover:bg-mint-700"
                >
                    Fai un nuovo ordine
                </button>
            </main>
        </div>
    );
}
