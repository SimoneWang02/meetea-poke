import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    POKE_DIMENSIONI,
    BOBA_CATEGORIE,
    SNACKS_LISTA,
} from "../../lib/options";

const STICKY_HEADER = 120; // navbar + stepper (matches header in Ordina.jsx)
const HEADER_OFFSET = 180; // navbar + stepper + tab bar (for scroll-margin)

export default function StepOrdina({ onOpenModal, onAddSfizioDirect }) {
    const sections = useMemo(
        () => [
            { id: "poke", titolo: "Poke" },
            ...BOBA_CATEGORIE.map((c) => ({ id: c.id, titolo: c.titolo })),
            { id: "sfizi", titolo: "Sfizi" },
        ],
        [],
    );

    const [active, setActive] = useState(sections[0].id);
    const sectionRefs = useRef({});
    const tabRefs = useRef({});
    const programmaticScroll = useRef(false);

    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => {
                if (programmaticScroll.current) return;
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.target.getBoundingClientRect().top -
                            b.target.getBoundingClientRect().top,
                    );
                if (visible[0]) setActive(visible[0].target.id);
            },
            { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
        );
        Object.values(sectionRefs.current).forEach((el) => {
            if (el) obs.observe(el);
        });
        return () => obs.disconnect();
    }, [sections]);

    useEffect(() => {
        const tab = tabRefs.current[active];
        tab?.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
        });
    }, [active]);

    const scrollToSection = (id) => {
        const el = sectionRefs.current[id];
        if (!el) return;
        programmaticScroll.current = true;
        setActive(id);
        const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top, behavior: "smooth" });
        setTimeout(() => {
            programmaticScroll.current = false;
        }, 600);
    };

    const activeIdx = sections.findIndex((s) => s.id === active);
    const goAdjacent = (dir) => {
        const next = dir === "right" ? activeIdx + 1 : activeIdx - 1;
        if (next < 0 || next >= sections.length) return;
        scrollToSection(sections[next].id);
    };
    const atStart = activeIdx <= 0;
    const atEnd = activeIdx >= sections.length - 1;

    return (
        <div>
            <nav
                aria-label="Categorie"
                style={{
                    top: STICKY_HEADER,
                    marginLeft: "calc(50% - 50vw)",
                    marginRight: "calc(50% - 50vw)",
                }}
                className="sticky z-30 w-screen border-b border-stone-200 bg-white/95 backdrop-blur-md"
            >
                <div className="mx-auto flex max-w-2xl items-center gap-1 px-2 py-3">
                    <button
                        type="button"
                        onClick={() => goAdjacent("left")}
                        disabled={atStart}
                        aria-label="Categoria precedente"
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-stone-300 disabled:hover:bg-transparent"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                        >
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <div className="scrollbar-none flex flex-1 gap-1 overflow-x-auto">
                        {sections.map((s) => {
                            const isActive = active === s.id;
                            return (
                                <button
                                    key={s.id}
                                    ref={(el) => (tabRefs.current[s.id] = el)}
                                    type="button"
                                    onClick={() => scrollToSection(s.id)}
                                    aria-current={isActive ? "true" : undefined}
                                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
                                        isActive
                                            ? "bg-mint-700 text-white"
                                            : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                                    }`}
                                >
                                    {s.titolo}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        type="button"
                        onClick={() => goAdjacent("right")}
                        disabled={atEnd}
                        aria-label="Categoria successiva"
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-stone-300 disabled:hover:bg-transparent"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                        >
                            <path d="M9 6l6 6-6 6" />
                        </svg>
                    </button>
                </div>
            </nav>

            <div className="space-y-10 py-8">
                {/* Poke */}
                <section
                    id="poke"
                    ref={(el) => (sectionRefs.current["poke"] = el)}
                    style={{ scrollMarginTop: HEADER_OFFSET }}
                >
                    <SectionHeader titolo="Poke" />
                    <div className="grid gap-3 sm:grid-cols-2">
                        {POKE_DIMENSIONI.map((d) => (
                            <PokeCard
                                key={d.id}
                                dimensione={d}
                                onClick={() =>
                                    onOpenModal({
                                        type: "poke",
                                        payload: { dimensione: d },
                                    })
                                }
                            />
                        ))}
                    </div>
                </section>

                {/* Boba sotto-categorie */}
                {BOBA_CATEGORIE.map((cat) => (
                    <section
                        key={cat.id}
                        id={cat.id}
                        ref={(el) => (sectionRefs.current[cat.id] = el)}
                        style={{ scrollMarginTop: HEADER_OFFSET }}
                    >
                        <SectionHeader titolo={cat.titolo} />
                        <div className="grid gap-3 sm:grid-cols-2">
                            {cat.items.map((item) => (
                                <BobaCard
                                    key={item.nome}
                                    item={item}
                                    onClick={() =>
                                        onOpenModal({
                                            type: "boba",
                                            payload: {
                                                item,
                                                categoria: cat.id,
                                            },
                                        })
                                    }
                                />
                            ))}
                        </div>
                    </section>
                ))}

                {/* Sfizi */}
                <section
                    id="sfizi"
                    ref={(el) => (sectionRefs.current["sfizi"] = el)}
                    style={{ scrollMarginTop: HEADER_OFFSET }}
                >
                    <SectionHeader titolo="Sfizi" />
                    <div className="grid gap-3 sm:grid-cols-2">
                        {SNACKS_LISTA.map((sfizio) => (
                            <SfizioCard
                                key={sfizio.nome}
                                sfizio={sfizio}
                                onClick={() => {
                                    if (sfizio.opzioni.length === 1) {
                                        onAddSfizioDirect(sfizio);
                                    } else {
                                        onOpenModal({
                                            type: "sfizio",
                                            payload: { sfizio },
                                        });
                                    }
                                }}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

function SectionHeader({ titolo }) {
    return (
        <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-stone-900">
            {titolo}
        </h2>
    );
}

function PokeCard({ dimensione, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-4 text-left transition hover:border-mint-300 hover:shadow-sm"
        >
            <div className="min-w-0">
                <div className="text-base font-bold">
                    Poke Bowl {dimensione.nome}
                </div>
                <div className="mt-1 text-xs text-stone-500">
                    {dimensione.proteine} prot · {dimensione.green} green ·{" "}
                    {dimensione.crispy} crispy · {dimensione.salse} sals
                    {dimensione.salse > 1 ? "e" : "a"}
                </div>
                <div className="mt-2 text-lg font-extrabold text-mint-700">
                    {dimensione.prezzo.toFixed(2)} €
                </div>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint-600 text-white">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                >
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                </svg>
            </div>
        </button>
    );
}

function BobaCard({ item, onClick }) {
    const sizes = Object.keys(item.prezzi);
    const minPrice = Math.min(...sizes.map((s) => item.prezzi[s]));
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-4 text-left transition hover:border-accent-300 hover:shadow-sm"
        >
            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    <div className="text-base font-bold">{item.nome}</div>
                    {item.topSeller && (
                        <span className="rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-700">
                            Top
                        </span>
                    )}
                </div>
                {item.ingredienti && (
                    <div className="mt-1 line-clamp-2 text-xs text-stone-500">
                        {item.ingredienti}
                    </div>
                )}
                <div className="mt-2 text-lg font-extrabold text-accent-600">
                    {sizes.length > 1
                        ? `da ${minPrice.toFixed(2)} €`
                        : `${minPrice.toFixed(2)} €`}
                </div>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-500 text-white">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                >
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                </svg>
            </div>
        </button>
    );
}

function SfizioCard({ sfizio, onClick }) {
    const prices = sfizio.opzioni.map((o) => o.prezzo);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-4 text-left transition hover:border-mint-300 hover:shadow-sm"
        >
            <div className="flex min-w-0 flex-1 items-center gap-3">
                {sfizio.image && (
                    <img
                        src={`/images/snacks/${sfizio.image}`}
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                    />
                )}
                <div className="min-w-0">
                    <div className="text-base font-bold">{sfizio.nome}</div>
                    <div className="mt-1 text-xs text-stone-500">
                        {sfizio.opzioni.map((o) => o.qty).join(" · ")}
                    </div>
                    <div className="mt-1 text-lg font-extrabold text-mint-700">
                        {min === max
                            ? `${min.toFixed(2)} €`
                            : `${min.toFixed(2)} – ${max.toFixed(2)} €`}
                    </div>
                </div>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint-600 text-white">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                >
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                </svg>
            </div>
        </button>
    );
}
