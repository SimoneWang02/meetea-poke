import React, { useEffect, useMemo, useRef, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabScrollButton from "@mui/material/TabScrollButton";
import { BOBA_CATEGORIE, BOBA_TOPPING } from "../lib/options";
import { formatPrezzo } from "../lib/format";
import { useInView } from "../lib/useInView";

const MINT_500 = "#14b8a6";
const MINT_700 = "#0f766e";
const STONE_700 = "#44403c";

function InfoIcon({ className = "h-4 w-4" }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="9.5" />
            <path d="M12 11v5" />
            <circle cx="12" cy="7.8" r="0.6" fill="currentColor" />
        </svg>
    );
}

const tabsSx = {
    minHeight: 0,
    "& .MuiTabs-indicator": {
        display: "none",
    },
    "& .MuiTab-root": {
        textTransform: "none",
        fontFamily: "inherit",
        fontWeight: 600,
        fontSize: "0.875rem",
        color: STONE_700,
        minHeight: 0,
        paddingY: "0.5rem",
        paddingX: "1rem",
        borderRadius: "9999px",
        backgroundColor: "#ffffff",
        border: "1px solid #d6d3d1",
        marginX: "0.25rem",
        transition: "background-color 0.15s, color 0.15s, border-color 0.15s",
    },
    "& .MuiTab-root:hover": {
        backgroundColor: "#f5f5f4",
        color: STONE_700,
    },
    "& .MuiTab-root.Mui-selected": {
        backgroundColor: MINT_500,
        color: "#fff",
        borderColor: MINT_500,
    },
    "& .MuiTab-root.Mui-selected:hover": {
        backgroundColor: MINT_700,
        color: "#fff",
        borderColor: MINT_700,
    },
    "&& .MuiTabs-scrollButtons": {
        color: STONE_700,
        backgroundColor: "#ffffff !important",
        borderRadius: "9999px",
        border: "1px solid #d6d3d1",
        width: 36,
        height: 36,
        marginX: "0.25rem",
        transition: "background-color 0.15s",
        opacity: "1 !important",
    },
    "&& .MuiTabs-scrollButtons:hover": {
        backgroundColor: "#f5f5f4 !important",
    },
    "&& .MuiTabs-scrollButtons.Mui-disabled": {
        opacity: "1 !important",
        color: "#a8a29e",
        backgroundColor: "#ffffff !important",
    },
};

const NavContext = React.createContext({ activeIndex: 0, onNav: () => {} });

const ScrollButtonNav = React.forwardRef(function ScrollButtonNav(props, ref) {
    const { onClick: _ignored, direction, ...rest } = props;
    const { activeIndex, onNav } = React.useContext(NavContext);
    const navDisabled =
        direction === "right"
            ? activeIndex >= BOBA_CATEGORIE.length - 1
            : activeIndex <= 0;
    return (
        <TabScrollButton
            {...rest}
            ref={ref}
            direction={direction}
            disabled={navDisabled}
            onClick={() => onNav(direction)}
        />
    );
});

const tabsSlots = { scrollButtons: ScrollButtonNav };

function InfoPopover({ testo }) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onDown = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        const onKey = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <span
            ref={wrapperRef}
            className="relative inline-flex"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                aria-label="Mostra ingredienti"
                aria-expanded={open}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-stone-400 transition hover:text-mint-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-500"
            >
                <InfoIcon />
            </button>
            {open && (
                <span
                    role="tooltip"
                    className="absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-xs -translate-x-1/2 rounded-xl bg-white p-3 text-xs leading-relaxed text-stone-600 shadow-lg ring-1 ring-stone-300"
                >
                    {testo}
                </span>
            )}
        </span>
    );
}

function BobaSvg() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
        >
            <path
                d="M18 9L16.5218 18.4136C16.2728 19.9992 16.1483 20.7921 15.5864 21.2644C14.3865 22.273 9.54699 22.217 8.41358 21.2644C7.85167 20.7921 7.72718 19.9992 7.47819 18.4136L6 9"
                strokeLinecap="round"
            />
            <path d="M6 9L6.51444 7.71391C7.41167 5.47084 9.58414 4 12 4C14.4159 4 16.5883 5.47084 17.4856 7.71391L18 9" />
            <path d="M5 9H19" strokeLinecap="round" />
            <path d="M13 9L16 2" strokeLinecap="round" />
            <path
                d="M13.125 13H13M13.25 13C13.25 13.1381 13.1381 13.25 13 13.25C12.8619 13.25 12.75 13.1381 12.75 13C12.75 12.8619 12.8619 12.75 13 12.75C13.1381 12.75 13.25 12.8619 13.25 13Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M13.625 18H13.5M13.75 18C13.75 18.1381 13.6381 18.25 13.5 18.25C13.3619 18.25 13.25 18.1381 13.25 18C13.25 17.8619 13.3619 17.75 13.5 17.75C13.6381 17.75 13.75 17.8619 13.75 18Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10.125 15.5H10M10.25 15.5C10.25 15.6381 10.1381 15.75 10 15.75C9.86193 15.75 9.75 15.6381 9.75 15.5C9.75 15.3619 9.86193 15.25 10 15.25C10.1381 15.25 10.25 15.3619 10.25 15.5Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ToppingSvg() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="19" cy="13" r="2" />
            <circle cx="13" cy="19" r="3" />
            <circle cx="8.5" cy="7.5" r="5.5" />
            <path d="M6 7.5C6 6.11929 7.11929 5 8.5 5" />
        </svg>
    );
}

function IconBadge({ kind, size = "md", variant = "mint" }) {
    const sizing =
        size === "sm"
            ? "h-7 w-7 rounded-lg [&_svg]:h-4 [&_svg]:w-4"
            : "h-14 w-14 rounded-2xl [&_svg]:h-8 [&_svg]:w-8";
    const palette =
        variant === "on-accent"
            ? "bg-white/25 text-white"
            : "bg-mint-100 text-mint-700 ring-1 ring-mint-200";
    return (
        <span
            aria-hidden="true"
            className={`inline-flex shrink-0 items-center justify-center ${palette} ${sizing}`}
        >
            {kind === "boba" ? <BobaSvg /> : <ToppingSvg />}
        </span>
    );
}

function ItemRow({ item, sizes }) {
    return (
        <li className="flex items-baseline justify-between gap-4 border-t border-stone-100 py-3 [&:first-child]:border-t-0">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-medium text-stone-800">{item.nome}</span>
                {item.ingredienti && <InfoPopover testo={item.ingredienti} />}
                {item.topSeller && (
                    <span className="inline-flex items-center rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-700 ring-1 ring-accent-200">
                        Top Seller
                    </span>
                )}
            </div>
            <div className="flex shrink-0 items-baseline gap-4 tabular-nums sm:gap-8">
                {sizes.map((s) => (
                    <span
                        key={s}
                        className={
                            item.prezzi[s] == null
                                ? "w-16 text-right text-stone-300"
                                : "w-16 text-right font-semibold text-mint-700"
                        }
                    >
                        {item.prezzi[s] != null
                            ? formatPrezzo(item.prezzi[s])
                            : "-"}
                    </span>
                ))}
            </div>
        </li>
    );
}

function CategoryCard({ categoria }) {
    const showSizeHeader = categoria.sizes.length > 1;
    return (
        <div className="rounded-3xl bg-white p-6 ring-1 ring-stone-300 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-stone-200 pb-3">
                <div className="flex items-center gap-3">
                    <IconBadge kind="boba" />
                    <h3 className="text-lg font-bold tracking-tight text-stone-900 sm:text-xl">
                        {categoria.titolo}
                    </h3>
                </div>
                <div className="ml-auto flex shrink-0 items-baseline gap-4 sm:gap-8">
                    {showSizeHeader ? (
                        categoria.sizes.map((s) => (
                            <span
                                key={s}
                                className="w-16 text-right text-xs font-semibold uppercase tracking-[0.2em] text-accent-500"
                            >
                                {s === "M" ? "Medio" : "Grande"}
                            </span>
                        ))
                    ) : (
                        <span className="w-16 text-right text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">
                            Grande
                        </span>
                    )}
                </div>
            </div>
            <ul>
                {categoria.items.map((item) => (
                    <ItemRow
                        key={item.nome}
                        item={item}
                        sizes={categoria.sizes}
                    />
                ))}
            </ul>
        </div>
    );
}

function ToppingRow({ nome, prezzo }) {
    return (
        <li className="flex items-baseline justify-between gap-4 border-t border-stone-100 py-3 [&:first-child]:border-t-0">
            <span className="font-medium text-stone-800">{nome}</span>
            <span className="shrink-0 font-semibold text-mint-700 tabular-nums">
                {formatPrezzo(prezzo)}
            </span>
        </li>
    );
}

function ToppingSubsection({ titolo, prezzo, gusti }) {
    return (
        <div className="mt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-stone-200 pb-2">
                <h4 className="text-base font-bold tracking-tight text-stone-900">
                    {titolo}
                </h4>
                <span className="font-semibold text-mint-700 tabular-nums">
                    {formatPrezzo(prezzo)}
                </span>
            </div>
            <ul className="mt-3 grid grid-cols-3 gap-2">
                {gusti.map((g) => (
                    <li
                        key={g}
                        className="rounded-xl bg-stone-50 px-3 py-2 text-center text-sm font-medium text-stone-700 ring-1 ring-stone-200"
                    >
                        {g}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ToppingCard() {
    return (
        <div className="rounded-3xl bg-white p-6 ring-1 ring-stone-300 sm:p-8">
            <div className="border-b border-stone-200 pb-3">
                <div className="flex items-center gap-3">
                    <IconBadge kind="topping" />
                    <div className="flex flex-col items-start gap-1">
                        <h3 className="text-lg font-bold tracking-tight text-stone-900 sm:text-xl">
                            Toppings
                        </h3>
                        <span className="inline-flex items-center rounded-full bg-accent-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                            1 topping da 0,50€ incluso
                        </span>
                    </div>
                </div>
            </div>
            <ul>
                {BOBA_TOPPING.singoli.map((t) => (
                    <ToppingRow key={t.nome} nome={t.nome} prezzo={t.prezzo} />
                ))}
            </ul>
            {BOBA_TOPPING.gruppi.map((g) => (
                <ToppingSubsection
                    key={g.nome}
                    titolo={g.nome}
                    prezzo={g.prezzo}
                    gusti={g.gusti}
                />
            ))}
        </div>
    );
}

export default function BobaSection() {
    const [headerRef, headerInView] = useInView();
    const [activeId, setActiveId] = useState(BOBA_CATEGORIE[0].id);
    const activeIndex = useMemo(() => {
        const idx = BOBA_CATEGORIE.findIndex((c) => c.id === activeId);
        return idx === -1 ? 0 : idx;
    }, [activeId]);
    const activeCategoria = BOBA_CATEGORIE[activeIndex];
    const tabsRef = useRef(null);

    const onNav = (direction) => {
        const next = direction === "right" ? activeIndex + 1 : activeIndex - 1;
        if (next < 0 || next >= BOBA_CATEGORIE.length) return;
        setActiveId(BOBA_CATEGORIE[next].id);
    };

    const navCtx = useMemo(
        () => ({ activeIndex, onNav: (dir) => onNav(dir) }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [activeIndex],
    );

    useEffect(() => {
        const scroller = tabsRef.current?.querySelector(".MuiTabs-scroller");
        const selected = tabsRef.current?.querySelector(
            'button[role="tab"][aria-selected="true"]',
        );
        if (!scroller || !selected) return;

        const scrollerRect = scroller.getBoundingClientRect();
        const selectedRect = selected.getBoundingClientRect();
        const tabCenter =
            selectedRect.left -
            scrollerRect.left +
            scroller.scrollLeft +
            selectedRect.width / 2;
        const max = scroller.scrollWidth - scroller.clientWidth;
        const targetRaw = tabCenter - scroller.clientWidth / 2;
        const target = Math.max(0, Math.min(targetRaw, max));

        const start = scroller.scrollLeft;
        const distance = target - start;
        if (Math.abs(distance) < 1) return;

        const duration = 320;
        const startTime = performance.now();
        const ease = (t) => 0.5 * (1 - Math.cos(Math.PI * t));
        let rafId;

        const step = (now) => {
            const t = Math.min(1, (now - startTime) / duration);
            scroller.scrollLeft = start + distance * ease(t);
            if (t < 1) rafId = requestAnimationFrame(step);
        };
        rafId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafId);
    }, [activeId]);

    return (
        <section
            id="menu"
            className="relative overflow-hidden bg-stone-50 py-16 sm:py-24"
        >
            <div className="relative z-10 mx-auto max-w-6xl px-6">
                <div
                    ref={headerRef}
                    className={`max-w-2xl ${headerInView ? "animate-fade-in-up" : "opacity-0"}`}
                >
                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-500">
                        Bubble Tea
                    </div>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        Il nostro menù
                    </h2>
                    <p className="mt-4 text-stone-600">
                        Esplora tutti i nostri bubble tea, dai classici alle
                        creazioni speciali. Passa sopra l'icona{" "}
                        <span className="inline-flex h-4 w-4 -mb-0.5 items-center justify-center rounded-full text-stone-500 align-middle">
                            <InfoIcon />
                        </span>{" "}
                        per scoprire gli ingredienti dei bubble tea speciali.
                    </p>
                </div>

                <div className="sticky top-0 z-30 mt-5 py-3">
                    <NavContext.Provider value={navCtx}>
                        <Tabs
                            ref={tabsRef}
                            value={activeId}
                            onChange={(_, v) => setActiveId(v)}
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            aria-label="Categorie boba"
                            slots={tabsSlots}
                            sx={tabsSx}
                        >
                            {BOBA_CATEGORIE.map((cat) => (
                                <Tab
                                    key={cat.id}
                                    value={cat.id}
                                    label={cat.titolo}
                                    id={`boba-tab-${cat.id}`}
                                    aria-controls={`boba-panel-${cat.id}`}
                                />
                            ))}
                        </Tabs>
                    </NavContext.Provider>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5 lg:items-start">
                    <div
                        role="tabpanel"
                        id={`boba-panel-${activeCategoria.id}`}
                        aria-labelledby={`boba-tab-${activeCategoria.id}`}
                        className="lg:col-span-3"
                    >
                        <CategoryCard categoria={activeCategoria} />
                    </div>

                    <aside className="lg:col-span-2 lg:sticky lg:top-20">
                        <ToppingCard />
                    </aside>
                </div>
            </div>
        </section>
    );
}
