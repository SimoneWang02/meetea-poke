import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMenu } from "../../lib/MenuProvider";
import { formatPrezzo, formatNumero } from "../../lib/format";
import { animateScroll } from "../../lib/scroll";

export const TAB_BAR_HEIGHT = 60;

export function useMenuNav(headerHeight) {
    const { menu } = useMenu();
    const BOBA_CATEGORIE = menu?.BOBA_CATEGORIE ?? [];
    const BEVANDE_LISTA = menu?.BEVANDE_LISTA ?? [];

    const sections = useMemo(
        () => [
            { id: "poke", titolo: "Poke" },
            ...BOBA_CATEGORIE.map((c) => ({ id: c.id, titolo: c.titolo })),
            { id: "sfizi", titolo: "Sfizi" },
            ...(BEVANDE_LISTA.length ? [{ id: "bevande", titolo: "Bevande" }] : []),
        ],
        [BOBA_CATEGORIE, BEVANDE_LISTA.length],
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
        const targetY =
            el.getBoundingClientRect().top + window.scrollY - headerHeight;
        animateScroll(targetY, 520, () => {
            programmaticScroll.current = false;
        });
    };

    return { sections, active, sectionRefs, tabRefs, scrollToSection };
}

export function CategoryNav({ sections, active, tabRefs, onScrollToSection }) {
    const activeIdx = sections.findIndex((s) => s.id === active);
    const goAdjacent = (dir) => {
        const next = dir === "right" ? activeIdx + 1 : activeIdx - 1;
        if (next < 0 || next >= sections.length) return;
        onScrollToSection(sections[next].id);
    };
    const atStart = activeIdx <= 0;
    const atEnd = activeIdx >= sections.length - 1;

    return (
        <nav aria-label="Categorie" className="border-t border-stone-100">
            <div className="mx-auto max-w-7xl lg:max-w-screen-2xl flex items-center gap-1 px-4 py-3">
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
                                onClick={() => onScrollToSection(s.id)}
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
    );
}

export default function StepOrdina({
    sections,
    sectionRefs,
    headerHeight = 120,
    onOpenModal,
    onAddSfizioDirect,
    onAddBevandaDirect,
}) {
    const { menu } = useMenu();
    const POKE_DIMENSIONI = menu?.POKE_DIMENSIONI ?? [];
    const BOBA_CATEGORIE = menu?.BOBA_CATEGORIE ?? [];
    const SNACKS_LISTA = menu?.SNACKS_LISTA ?? [];
    const BEVANDE_LISTA = menu?.BEVANDE_LISTA ?? [];

    if (!menu) return null;

    return (
        <div className="space-y-10 pb-8">
            {/* Poke */}
            <section
                id="poke"
                ref={(el) => (sectionRefs.current["poke"] = el)}
                style={{ scrollMarginTop: headerHeight }}
                className="pt-6"
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
                    style={{ scrollMarginTop: headerHeight }}
                    className="pt-6"
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
                                        payload: { item, categoria: cat.id },
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
                style={{ scrollMarginTop: headerHeight }}
                className="pt-6"
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

            {/* Bevande */}
            {BEVANDE_LISTA.length > 0 && (
                <section
                    id="bevande"
                    ref={(el) => (sectionRefs.current["bevande"] = el)}
                    style={{ scrollMarginTop: headerHeight }}
                    className="pt-6"
                >
                    <SectionHeader titolo="Bevande" />
                    <div className="grid gap-3 sm:grid-cols-2">
                        {BEVANDE_LISTA.map((bevanda) => (
                            <BevandaCard
                                key={bevanda.nome}
                                bevanda={bevanda}
                                onClick={() => onAddBevandaDirect(bevanda)}
                            />
                        ))}
                    </div>
                </section>
            )}
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
                <div className="mt-2 text-lg font-extrabold text-mint-700">
                    {formatPrezzo(dimensione.prezzo)}
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
            className="flex w-full items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-4 text-left transition hover:border-mint-300 hover:shadow-sm"
        >
            <div className="flex min-w-0 flex-1 items-center gap-3">
                {item.image && (
                    <img
                        src={item.image}
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-xl object-contain"
                    />
                )}
                <div className="min-w-0">
                    <div className="text-base font-bold">{item.nome}</div>
                    {item.ingredienti && (
                        <div className="mt-1 line-clamp-2 text-xs text-stone-500">
                            {item.ingredienti}
                        </div>
                    )}
                    <div className="mt-2 text-lg font-extrabold text-mint-700">
                        {formatPrezzo(minPrice)}
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

function BevandaCard({ bevanda, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-4 text-left transition hover:border-mint-300 hover:shadow-sm"
        >
            <div className="flex min-w-0 flex-1 items-center gap-3">
                {bevanda.image && (
                    <img
                        src={bevanda.image}
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                    />
                )}
                <div className="min-w-0">
                    <div className="text-base font-bold">{bevanda.nome}</div>
                    <div className="mt-1 text-lg font-extrabold text-mint-700">
                        {formatPrezzo(bevanda.prezzo)}
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
                        src={sfizio.image}
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                    />
                )}
                <div className="min-w-0">
                    <div className="text-base font-bold">{sfizio.nome}</div>
                    <div className="mt-1 text-lg font-extrabold text-mint-700">
                        {min === max
                            ? formatPrezzo(min)
                            : `${formatNumero(min)} – ${formatNumero(max)} €`}
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
