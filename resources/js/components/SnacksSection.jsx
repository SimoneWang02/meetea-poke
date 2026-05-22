import React from "react";
import { SNACKS_LISTA } from "../lib/options";
import { formatPrezzo } from "../lib/format";

function PlaceholderImage() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-mint-200 to-accent-200 text-mint-800">
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-12 w-12 opacity-80"
            >
                <path d="M3 13a9 9 0 0 1 18 0" />
                <path d="M2 13h20" />
                <path d="M5 17h14" />
                <path d="M12 4V2" />
            </svg>
            <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-mint-700/80">
                Foto in arrivo
            </span>
        </div>
    );
}

function PolaroidCard({ snack, index }) {
    const tilt = index % 2 === 0 ? "-rotate-1" : "rotate-1";
    return (
        <div
            className={`group ${tilt} transform-gpu transition-transform duration-300 hover:rotate-0 hover:-translate-y-1`}
        >
            <div className="flex h-full flex-col rounded-md bg-white p-3 pb-5 shadow-lg shadow-stone-900/10 ring-1 ring-stone-300">
                <div className="aspect-square w-full overflow-hidden rounded-sm bg-stone-100">
                    {snack.image ? (
                        <img
                            src={`/images/snacks/${snack.image}`}
                            alt={snack.nome}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <PlaceholderImage />
                    )}
                </div>
                <div className="mt-4 text-center text-base font-bold text-stone-900">
                    {snack.nome}
                </div>
                <ul className="mt-2 space-y-1">
                    {snack.opzioni.map((o) => (
                        <li
                            key={o.qty}
                            className="flex items-center justify-center gap-3 text-sm"
                        >
                            <span className="text-stone-500">{o.qty}</span>
                            <span className="font-semibold text-mint-700 tabular-nums">
                                {formatPrezzo(o.prezzo)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default function SnacksSection() {
    return (
        <section
            id="sfizi"
            className="relative overflow-hidden bg-stone-50 py-16 sm:py-24"
        >
            <div className="relative z-10 mx-auto max-w-6xl px-6">
                <div className="max-w-2xl">
                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-500">
                        Snacks
                    </div>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        I nostri sfizi
                    </h2>
                    <p className="mt-4 text-stone-600">
                        Snacks salati e dolci per completare il tuo ordine: dai
                        ravioli al vapore ai mochi, perfetti da soli o insieme a
                        bowl e bubble tea.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                    {SNACKS_LISTA.map((snack, i) => (
                        <PolaroidCard
                            key={snack.nome}
                            snack={snack}
                            index={i}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
