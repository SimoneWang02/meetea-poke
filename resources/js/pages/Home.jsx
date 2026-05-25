import React from "react";
import { Link } from "react-router-dom";
import { formatPrezzo, formatNumero } from "../lib/format";
import {
    POKE_DIMENSIONI,
    POKE_BASI,
    POKE_BASI_MAX,
    POKE_PROTEINE,
    POKE_GREEN,
    POKE_CRISPY,
    POKE_SALSE,
    POKE_EXTRA_PREZZI,
    ORARI_APERTURA,
    CONTATTI,
} from "../lib/options";
import BobaSection from "../components/BobaSection";
import SnacksSection from "../components/SnacksSection";
import Navbar from "../components/Navbar";
import HeroSection from "../components/hero/HeroSection";
import PageLoader from "../components/PageLoader";
import { heroGridSources } from "../lib/heroImages";
import { useInView } from "../lib/useInView";

function BentoTile({
    numero,
    etichetta,
    sottotitolo,
    items,
    className = "",
    style,
}) {
    return (
        <div
            className={`flex flex-col rounded-3xl bg-white p-6 ring-1 ring-stone-300 ${className}`}
            style={style}
        >
            <div className="flex items-center gap-3">
                {numero != null && (
                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-white">
                        {numero}
                    </span>
                )}
                <div className="flex flex-col">
                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-500">
                        {etichetta}
                    </div>
                    {sottotitolo && (
                        <div className="text-xs font-medium text-stone-500">
                            {sottotitolo}
                        </div>
                    )}
                </div>
            </div>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-stone-700 marker:text-mint-500">
                {items.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

export default function Home() {
    const [pokeHeaderRef, pokeHeaderInView] = useInView();
    const [pokeGridRef, pokeGridInView] = useInView();
    const [orariRef, orariInView] = useInView();
    const [doveRef, doveInView] = useInView();

    return (
        <div className="font-sans text-stone-900">
            <PageLoader images={heroGridSources} />
            <Navbar />

            {/* Hero */}
            <HeroSection />

            {/* Boba */}
            <BobaSection />

            {/* Poke */}
            <section
                id="poke"
                className="relative overflow-hidden bg-white py-16 sm:py-24"
            >
                <img
                    src="/images/homepage/blob.svg"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 right-0 z-0 h-auto w-[34rem] select-none sm:w-[47rem] md:w-[60rem]"
                />
                <img
                    src="/images/homepage/blob_2.svg"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-0 z-0 h-auto w-[34rem] select-none sm:left-auto sm:right-0 sm:w-[47rem] sm:-scale-x-100 md:w-[60rem] lg:left-0 lg:right-auto lg:scale-x-100"
                />
                <img
                    src="/images/homepage/poke.png"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-28 -right-20 z-0 h-64 w-64 select-none object-contain sm:-top-32 sm:-right-32 sm:h-80 sm:w-80 md:-top-40 md:-right-40 md:h-[28rem] md:w-[28rem]"
                />
                <img
                    src="/images/homepage/poke_2.png"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute z-0 hidden select-none object-contain sm:block sm:-bottom-32 sm:-right-32 sm:h-80 sm:w-80 md:-bottom-40 md:-right-40 md:h-[28rem] md:w-[28rem] lg:right-auto lg:-left-40"
                />
                <div className="relative z-10 mx-auto max-w-6xl px-6">
                    <div
                        ref={pokeHeaderRef}
                        className={`max-w-lg ${pokeHeaderInView ? "animate-fade-in-up" : "opacity-0"}`}
                    >
                        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-500">
                            Poke Bowl
                        </div>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                            Una bowl,
                            <br />
                            infinite combinazioni
                        </h2>
                        <p className="mt-4 text-stone-600">
                            Scegli la dimensione, componi la tua base e
                            arricchisci con proteine, green, crispy e salse.
                        </p>
                    </div>

                    <div ref={pokeGridRef} className="mt-10 space-y-4">
                        {/* Dimensione (full width) */}
                        <div
                            className={`rounded-3xl bg-white p-6 ring-1 ring-stone-300 sm:p-8 ${pokeGridInView ? "animate-fade-in-up" : "opacity-0"}`}
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-white">
                                        1
                                    </span>
                                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-600">
                                        Scegli la dimensione
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 grid divide-y divide-stone-300 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                                {POKE_DIMENSIONI.map((d) => (
                                    <div
                                        key={d.id}
                                        className="px-0 py-5 first:pt-0 last:pb-0 sm:px-6 sm:py-0 sm:first:pl-0 sm:last:pr-0"
                                    >
                                        <div className="flex items-baseline justify-between gap-2">
                                            <div className="text-xl font-bold">
                                                {d.nome}
                                            </div>
                                            <div className="text-2xl font-extrabold text-mint-700">
                                                {formatPrezzo(d.prezzo)}
                                            </div>
                                        </div>
                                        <ul className="mt-3 space-y-1 text-sm text-stone-600">
                                            <li>
                                                <span className="font-semibold text-mint-600">
                                                    {d.proteine}
                                                </span>{" "}
                                                {d.proteine > 1
                                                    ? "Proteine"
                                                    : "Proteina"}
                                            </li>
                                            <li>
                                                <span className="font-semibold text-mint-600">
                                                    {d.green}
                                                </span>{" "}
                                                Green
                                            </li>
                                            <li>
                                                <span className="font-semibold text-mint-600">
                                                    {d.crispy}
                                                </span>{" "}
                                                Crispy
                                            </li>
                                            <li>
                                                <span className="font-semibold text-mint-600">
                                                    {d.salse}
                                                </span>{" "}
                                                Sals{d.salse > 1 ? "e" : "a"}
                                            </li>
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Masonry */}
                        <div className="gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
                            {[
                                {
                                    numero: 2,
                                    etichetta: `Scegli fino a ${POKE_BASI_MAX} basi`,
                                    items: POKE_BASI,
                                },
                                {
                                    numero: 3,
                                    etichetta: "Proteine",
                                    sottotitolo: `Extra ${formatNumero(POKE_EXTRA_PREZZI.proteine)} €`,
                                    items: POKE_PROTEINE,
                                },
                                {
                                    numero: 4,
                                    etichetta: "Green & co",
                                    sottotitolo: `Extra ${formatNumero(POKE_EXTRA_PREZZI.green)} €`,
                                    items: POKE_GREEN,
                                },
                                {
                                    numero: 5,
                                    etichetta: "Crispy",
                                    sottotitolo: `Extra ${formatNumero(POKE_EXTRA_PREZZI.crispy)} €`,
                                    items: POKE_CRISPY,
                                },
                                {
                                    numero: 6,
                                    etichetta: "Salse",
                                    sottotitolo: `Extra ${formatNumero(POKE_EXTRA_PREZZI.salse)} €`,
                                    items: POKE_SALSE,
                                },
                            ].map((tile, i) => (
                                <BentoTile
                                    key={tile.numero}
                                    numero={tile.numero}
                                    etichetta={tile.etichetta}
                                    sottotitolo={tile.sottotitolo}
                                    items={tile.items}
                                    className={
                                        pokeGridInView
                                            ? "animate-fade-in-up"
                                            : "opacity-0"
                                    }
                                    style={
                                        pokeGridInView
                                            ? {
                                                  animationDelay: `${80 + i * 80}ms`,
                                              }
                                            : undefined
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Snacks */}
            <SnacksSection />

            {/* Orari e dove siamo */}
            <section className="bg-white py-16 sm:py-24">
                <div className="mx-auto grid max-w-5xl gap-12 px-6 md:grid-cols-2">
                    <div
                        ref={orariRef}
                        className={
                            orariInView ? "animate-fade-in-up" : "opacity-0"
                        }
                    >
                        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-500">
                            Orari
                        </div>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight">
                            Quando siamo aperti
                        </h2>
                        <ul className="mt-6 divide-y divide-stone-200 rounded-2xl bg-stone-50 ring-1 ring-stone-200">
                            {ORARI_APERTURA.map(({ giorno, orario }) => (
                                <li
                                    key={giorno}
                                    className="flex items-center justify-between px-5 py-3"
                                >
                                    <span className="font-medium">
                                        {giorno}
                                    </span>
                                    <span
                                        className={
                                            orario === "chiuso"
                                                ? "text-stone-400"
                                                : "text-mint-700"
                                        }
                                    >
                                        {orario}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div
                        ref={doveRef}
                        className={`${doveInView ? "animate-fade-in-up [animation-delay:150ms]" : "opacity-0"}`}
                    >
                        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-500">
                            Dove siamo
                        </div>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight">
                            Vieni a trovarci
                        </h2>
                        <div className="mt-6 space-y-3">
                            <a
                                href={CONTATTI.mapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 rounded-2xl bg-stone-50 px-5 py-4 ring-1 ring-stone-200 transition hover:bg-stone-100"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-6 w-6 shrink-0 text-mint-700"
                                >
                                    <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11Z" />
                                    <circle cx="12" cy="10" r="2.5" />
                                </svg>
                                <span className="font-medium">
                                    {CONTATTI.indirizzo}
                                </span>
                            </a>
                            <a
                                href={`tel:${CONTATTI.telefonoTel}`}
                                className="flex items-center gap-3 rounded-2xl bg-stone-50 px-5 py-4 ring-1 ring-stone-200 transition hover:bg-stone-100"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-6 w-6 shrink-0 text-mint-700"
                                >
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
                                </svg>
                                <span className="font-medium">
                                    {CONTATTI.telefono}
                                </span>
                            </a>
                            <a
                                href={CONTATTI.instagram}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 rounded-2xl bg-stone-50 px-5 py-4 ring-1 ring-stone-200 transition hover:bg-stone-100"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="h-6 w-6 shrink-0"
                                >
                                    <defs>
                                        <radialGradient
                                            id="ig-gradient"
                                            cx="30%"
                                            cy="107%"
                                            r="150%"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#f9ce34"
                                            />
                                            <stop
                                                offset="25%"
                                                stopColor="#ee2a7b"
                                            />
                                            <stop
                                                offset="60%"
                                                stopColor="#c026d3"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#4f46e5"
                                            />
                                        </radialGradient>
                                    </defs>
                                    <rect
                                        x="2"
                                        y="2"
                                        width="20"
                                        height="20"
                                        rx="5"
                                        fill="url(#ig-gradient)"
                                    />
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="4.2"
                                        fill="none"
                                        stroke="#fff"
                                        strokeWidth="1.7"
                                    />
                                    <circle
                                        cx="17.4"
                                        cy="6.6"
                                        r="1.1"
                                        fill="#fff"
                                    />
                                </svg>
                                <span className="font-medium">
                                    {CONTATTI.instagramHandle}
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-stone-900 py-10 text-stone-300">
                <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
                    <div>
                        <img
                            src="/images/name.svg"
                            alt="MeeTea&Poke"
                            className="h-10 w-auto"
                        />
                        <div className="mt-2 text-sm text-stone-400">
                            © {new Date().getFullYear()} - Carpi (MO)
                        </div>
                    </div>
                    <nav className="flex flex-wrap gap-4 text-sm">
                        <Link
                            to="/admin"
                            className="text-stone-500 hover:text-stone-300"
                        >
                            Admin
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
