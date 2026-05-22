import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LINKS = [
    { id: "boba", label: "Bubble Tea" },
    { id: "poke", label: "Poke" },
    { id: "sfizi", label: "Sfizi" },
];

function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const navH = 72;
    const top = el.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: "smooth" });
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    const handleLink = (e, id) => {
        e.preventDefault();
        setOpen(false);
        scrollToId(id);
    };

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
                scrolled || open
                    ? "bg-white/90 backdrop-blur-md ring-1 ring-stone-200"
                    : "bg-transparent"
            }`}
        >
            <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                <Link
                    to="/"
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="flex items-center"
                >
                    <img
                        src="/images/logo.svg"
                        alt="MeeTea & Poke"
                        className="h-10 w-auto sm:h-12"
                    />
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                    {LINKS.map((l) => (
                        <a
                            key={l.id}
                            href={`#${l.id}`}
                            onClick={(e) => handleLink(e, l.id)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                scrolled
                                    ? "text-stone-700 hover:bg-stone-100"
                                    : "text-white/90 hover:bg-white/15"
                            }`}
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <Link
                        to="/ordina"
                        className="hidden rounded-full bg-mint-700 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-mint-900/20 transition hover:bg-mint-800 sm:inline-flex"
                    >
                        Ordina
                    </Link>
                    <button
                        type="button"
                        aria-label={open ? "Chiudi menu" : "Apri menu"}
                        aria-expanded={open}
                        onClick={() => setOpen((v) => !v)}
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden ${
                            scrolled || open
                                ? "text-stone-800 hover:bg-stone-100"
                                : "text-white hover:bg-white/15"
                        }`}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6"
                        >
                            {open ? (
                                <>
                                    <path d="M6 6l12 12" />
                                    <path d="M18 6L6 18" />
                                </>
                            ) : (
                                <>
                                    <path d="M3 6h18" />
                                    <path d="M3 12h18" />
                                    <path d="M3 18h18" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            <div
                className={`overflow-hidden border-t border-stone-200 bg-white/95 backdrop-blur-md transition-[max-height,opacity] duration-300 md:hidden ${
                    open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
                    {LINKS.map((l) => (
                        <a
                            key={l.id}
                            href={`#${l.id}`}
                            onClick={(e) => handleLink(e, l.id)}
                            className="rounded-xl px-4 py-3 text-base font-semibold text-stone-800 hover:bg-stone-100"
                        >
                            {l.label}
                        </a>
                    ))}
                    <Link
                        to="/ordina"
                        onClick={() => setOpen(false)}
                        className="mt-2 mb-2 inline-flex items-center justify-center rounded-full bg-mint-700 px-5 py-3 text-base font-semibold text-white shadow-md shadow-mint-900/20 hover:bg-mint-800"
                    >
                        Ordina
                    </Link>
                </nav>
            </div>
        </header>
    );
}
