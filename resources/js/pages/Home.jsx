import React from "react";
import { Link } from "react-router-dom";
import {
    POKE_BASI,
    POKE_PROTEINE,
    POKE_TOPPING,
    POKE_SALSE,
    TEA_BASI,
    TEA_LATTE,
    TEA_PEARLS,
    TEA_DOLCEZZA,
    TEA_GHIACCIO,
    ORARI_APERTURA,
    CONTATTI,
} from "../lib/options";

function MenuList({ titolo, items }) {
    return (
        <div className="mt-4">
            <div className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                {titolo}
            </div>
            <ul className="mt-2 flex flex-wrap gap-2">
                {items.map((item) => (
                    <li
                        key={item}
                        className="rounded-full bg-mint-50 px-3 py-1 text-sm text-mint-800 ring-1 ring-mint-200"
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Home() {
    const scrollToMenu = (e) => {
        e.preventDefault();
        document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="font-sans text-stone-900">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-mint-400 via-mint-500 to-mint-700 text-white">
                <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent-300 opacity-30 blur-3xl" />
                <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-mint-200 opacity-30 blur-3xl" />

                <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-20 sm:pt-28 sm:pb-28">
                    <h1 className="text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
                        MeeTea
                        <span className="text-accent-300">&amp;</span>
                        Poke
                    </h1>

                    <p className="mt-6 max-w-xl text-lg text-white/90 sm:text-xl">
                        Poke bowl e bubble tea artigianali a Carpi. Componi la
                        tua bowl, personalizza il tuo drink, ritira quando vuoi.
                    </p>

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                        <Link
                            to="/ordina"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-base font-semibold text-mint-800 shadow-lg shadow-mint-900/20 transition hover:bg-stone-50 sm:text-lg"
                        >
                            Ordina d'asporto
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
                                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                            </svg>
                        </Link>
                        <a
                            href="#menu"
                            onClick={scrollToMenu}
                            className="inline-flex items-center justify-center rounded-2xl bg-mint-800/40 px-6 py-4 text-base font-semibold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-mint-800/60 sm:text-lg"
                        >
                            Scopri il menu
                        </a>
                    </div>
                </div>
            </section>

            {/* Menu preview */}
            <section id="menu" className="bg-stone-50 py-16 sm:py-24">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="text-center">
                        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-500">
                            Il nostro menu
                        </div>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                            Tutto su misura, niente di standard
                        </h2>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-2">
                        {/* Poke */}
                        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
                            <div className="flex items-center gap-3">
                                <span className="text-4xl">🥗</span>
                                <h3 className="text-2xl font-bold">
                                    Poke Bowl
                                </h3>
                            </div>
                            <p className="mt-3 text-stone-600">
                                Componi la tua bowl con ingredienti freschi.
                            </p>
                            <MenuList titolo="Basi" items={POKE_BASI} />
                            <MenuList titolo="Proteine" items={POKE_PROTEINE} />
                            <MenuList titolo="Topping" items={POKE_TOPPING} />
                            <MenuList titolo="Salse" items={POKE_SALSE} />
                        </div>

                        {/* Bubble Tea */}
                        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
                            <div className="flex items-center gap-3">
                                <span className="text-4xl">🧋</span>
                                <h3 className="text-2xl font-bold">
                                    Bubble Tea
                                </h3>
                            </div>
                            <p className="mt-3 text-stone-600">
                                Personalizza il tuo drink dal tè alla dolcezza.
                            </p>
                            <MenuList titolo="Tea" items={TEA_BASI} />
                            <MenuList titolo="Latte" items={TEA_LATTE} />
                            <MenuList titolo="Pearls" items={TEA_PEARLS} />
                            <MenuList titolo="Dolcezza" items={TEA_DOLCEZZA} />
                            <MenuList titolo="Ghiaccio" items={TEA_GHIACCIO} />
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <Link
                            to="/ordina"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-mint-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-mint-500/30 transition hover:bg-mint-600 sm:text-lg"
                        >
                            Ordina d'asporto
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
                                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Orari e dove siamo */}
            <section className="bg-white py-16 sm:py-24">
                <div className="mx-auto grid max-w-5xl gap-12 px-6 md:grid-cols-2">
                    <div>
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

                    <div>
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
                        <div className="text-lg font-bold text-white">
                            MeeTea<span className="text-accent-400">&amp;</span>
                            Poke
                        </div>
                        <div className="text-sm text-stone-400">
                            © {new Date().getFullYear()} - Carpi (MO)
                        </div>
                    </div>
                    <nav className="flex flex-wrap gap-4 text-sm">
                        <Link to="/" className="hover:text-white">
                            Home
                        </Link>
                        <Link to="/ordina" className="hover:text-white">
                            Ordina d'asporto
                        </Link>
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
