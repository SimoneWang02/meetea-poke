import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { BOBA_CATEGORIE, BOBA_TOPPING } from "../lib/options";

const BOBA_IMAGES = [
    "B9363470-5B00-4096-AFC5-99CA56D7EB5E.PNG",
    "IMG_0049.PNG",
    "IMG_0051.PNG",
    "IMG_0053.PNG",
    "IMG_0054.PNG",
    "IMG_0056.PNG",
    "IMG_0059.PNG",
    "IMG_0060.PNG",
    "IMG_0061.PNG",
    "IMG_0062.PNG",
    "IMG_0063.PNG",
    "IMG_0065.PNG",
    "IMG_0066.PNG",
    "IMG_0067.PNG",
    "IMG_0068.PNG",
    "IMG_0069.PNG",
    "IMG_0070.PNG",
    "IMG_0071.PNG",
    "IMG_0072.PNG",
    "IMG_0073.PNG",
    "IMG_0074.PNG",
    "IMG_0075.PNG",
    "IMG_0101.PNG",
    "IMG_0102.PNG",
    "IMG_0839.PNG",
];

const BOBA_COUNT = 200;

function FallingBoba() {
    const sprites = React.useMemo(() => {
        return Array.from({ length: BOBA_COUNT }, (_, i) => {
            const size = 40 + Math.random() * 80;
            const duration = 14 + (120 - size) * 0.18;
            const delay = -Math.random() * duration;
            const left = Math.random() * 100;
            const opacity = 0.35 + (size / 120) * 0.45;
            const img =
                BOBA_IMAGES[Math.floor(Math.random() * BOBA_IMAGES.length)];
            const keyframe =
                Math.random() < 0.5 ? "boba-fall" : "boba-fall-ccw";
            return {
                id: i,
                size,
                duration,
                delay,
                left,
                opacity,
                img,
                keyframe,
            };
        });
    }, []);

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
            style={{
                maskImage:
                    "linear-gradient(to bottom, transparent 0%, transparent 1%, black 7%)",
                WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, transparent 1%, black 7%)",
            }}
        >
            {sprites.map((s) => (
                <img
                    key={s.id}
                    src={`/images/boba/${s.img}`}
                    alt=""
                    className="boba-falling absolute top-0 select-none object-contain"
                    style={{
                        left: `${s.left}%`,
                        width: `${s.size}px`,
                        height: `${s.size}px`,
                        opacity: s.opacity,
                        animation: `${s.keyframe} ${s.duration}s linear ${s.delay}s infinite`,
                        willChange: "transform",
                    }}
                />
            ))}
        </div>
    );
}

const MINT_500 = "#14b8a6";
const MINT_700 = "#0f766e";
const STONE_500 = "#78716c";
const STONE_700 = "#44403c";

function formatPrezzo(n) {
    return n.toFixed(2).replace(".", ",") + " €";
}

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
        <span ref={wrapperRef} className="relative inline-flex">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label="Mostra ingredienti"
                aria-expanded={open}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-stone-400 transition hover:text-mint-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-500"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                >
                    <circle cx="12" cy="12" r="9.5" />
                    <path d="M12 11v5" />
                    <circle cx="12" cy="7.8" r="0.6" fill="currentColor" />
                </svg>
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

function ItemRow({ item, sizes }) {
    return (
        <li className="flex items-baseline justify-between gap-4 border-t border-stone-100 py-3 [&:first-child]:border-t-0 md:[&:nth-child(-n+2)]:border-t-0">
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
                            : "—"}
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
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b border-stone-200 pb-3">
                <h3 className="text-lg font-bold tracking-tight text-stone-900 sm:text-xl">
                    {categoria.titolo}
                </h3>
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
            <ul className="md:grid md:grid-cols-2 md:gap-x-10">
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
        <li className="flex items-baseline justify-between gap-4 border-t border-stone-100 py-3 [&:first-child]:border-t-0 md:[&:nth-child(-n+2)]:border-t-0">
            <span className="font-medium text-stone-800">{nome}</span>
            <span className="shrink-0 font-semibold text-mint-700 tabular-nums">
                +{formatPrezzo(prezzo)}
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
                    +{formatPrezzo(prezzo)}
                </span>
            </div>
            <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {gusti.map((g) => (
                    <li
                        key={g}
                        className="border-t border-stone-100 py-2 text-stone-700 [&:nth-child(-n+2)]:border-t-0 sm:[&:nth-child(-n+3)]:border-t-0 md:[&:nth-child(-n+4)]:border-t-0 lg:[&:nth-child(-n+5)]:border-t-0"
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
                <h3 className="text-lg font-bold tracking-tight text-stone-900 sm:text-xl">
                    Scegli Topping
                </h3>
                <p className="mt-1 text-sm text-stone-600">
                    Con ogni bubble tea è incluso un topping da 0,50€
                </p>
            </div>
            <ul className="md:grid md:grid-cols-2 md:gap-x-10">
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
    const [activeId, setActiveId] = useState(BOBA_CATEGORIE[0].id);
    const activeCategoria =
        BOBA_CATEGORIE.find((c) => c.id === activeId) ?? BOBA_CATEGORIE[0];
    const tabsRef = useRef(null);

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
            <FallingBoba />
            <div className="relative z-10 mx-auto max-w-6xl px-6">
                <div className="max-w-2xl">
                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-500">
                        Bubble Tea
                    </div>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        Il nostro menù
                    </h2>
                    <p className="mt-4 text-stone-600">
                        Tutti i nostri bubble tea, dai classici alle creazioni
                        speciali. Scegli la dimensione che preferisci,
                        <span className="font-semibold text-stone-800">
                            {" "}
                            Medio
                        </span>{" "}
                        o
                        <span className="font-semibold text-stone-800">
                            {" "}
                            Grande
                        </span>
                        . Tocca l'icona{" "}
                        <span className="inline-flex h-4 w-4 -mb-0.5 items-center justify-center rounded-full text-stone-500 align-middle">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                                aria-hidden="true"
                            >
                                <circle cx="12" cy="12" r="9.5" />
                                <path d="M12 11v5" />
                                <circle
                                    cx="12"
                                    cy="7.8"
                                    r="0.6"
                                    fill="currentColor"
                                />
                            </svg>
                        </span>{" "}
                        per scoprire gli ingredienti dei boba speciali.
                    </p>
                </div>

                <Tabs
                    ref={tabsRef}
                    value={activeId}
                    onChange={(_, v) => setActiveId(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    aria-label="Categorie boba"
                    sx={{
                        mt: 5,
                        minHeight: 0,
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        backgroundColor: "rgba(250, 250, 249, 0.4)",
                        borderRadius: "9999px",
                        "& .MuiTabs-indicator": {
                            backgroundColor: MINT_500,
                            height: 3,
                            borderRadius: "9999px",
                        },
                        "& .MuiTab-root": {
                            textTransform: "none",
                            fontFamily: "inherit",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            color: STONE_700,
                            minHeight: 0,
                            paddingY: "0.75rem",
                            paddingX: "1rem",
                        },
                        "& .MuiTab-root:hover": {
                            color: MINT_700,
                        },
                        "& .MuiTab-root.Mui-selected": {
                            color: MINT_700,
                        },
                        "& .MuiTabs-scrollButtons.Mui-disabled": {
                            opacity: 0.3,
                        },
                        "& .MuiTabs-scrollButtons": {
                            color: STONE_500,
                        },
                    }}
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

                <div
                    role="tabpanel"
                    id={`boba-panel-${activeCategoria.id}`}
                    aria-labelledby={`boba-tab-${activeCategoria.id}`}
                    className="mt-6"
                >
                    <CategoryCard categoria={activeCategoria} />
                </div>

                <div className="mt-6">
                    <ToppingCard />
                </div>
            </div>
        </section>
    );
}
