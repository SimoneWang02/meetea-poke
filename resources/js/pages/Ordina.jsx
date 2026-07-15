import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { isGiornoChiuso } from "../lib/options";
import { readCart, writeCart, clearCart } from "../lib/cartStorage";
import { useMenu } from "../lib/MenuProvider";
import StepOrdina, {
    useMenuNav,
    CategoryNav,
} from "../components/steps/StepOrdina";
import StepRiepilogo from "../components/steps/StepRiepilogo";
import StepDatiCliente from "../components/steps/StepDatiCliente";
import StepConferma from "../components/steps/StepConferma";
import PokeModal from "../components/order/PokeModal";
import BobaModal from "../components/order/BobaModal";
import SfizioModal from "../components/order/SfizioModal";
import CartSidebar from "../components/order/CartSidebar";

const STEPS_LABELS = ["Ordina", "Riepilogo", "Dati", "Conferma"];

function stepIndex(step) {
    switch (step) {
        case "ordina":
            return 0;
        case "riepilogo":
            return 1;
        case "dati":
            return 2;
        case "conferma":
            return 3;
        default:
            return 0;
    }
}

function ProgressBar({ step }) {
    const current = stepIndex(step);
    return (
        <ol className="mx-auto flex w-full max-w-xl items-start justify-center">
            {STEPS_LABELS.map((label, idx) => {
                const active = idx <= current;
                return (
                    <React.Fragment key={label}>
                        <li className="flex w-16 flex-col items-center">
                            <div
                                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition ${
                                    active
                                        ? "bg-mint-600 text-white"
                                        : "bg-stone-200 text-stone-500"
                                }`}
                            >
                                {idx + 1}
                            </div>
                            <span
                                className={`mt-1 text-center text-[10px] font-medium uppercase tracking-wider ${
                                    active ? "text-mint-700" : "text-stone-400"
                                }`}
                            >
                                {label}
                            </span>
                        </li>
                        {idx < STEPS_LABELS.length - 1 && (
                            <div
                                className={`mx-2 mt-3.5 h-0.5 min-w-4 flex-1 rounded-full transition ${
                                    idx < current
                                        ? "bg-mint-600"
                                        : "bg-stone-200"
                                }`}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </ol>
    );
}

export default function Ordina() {
    const { menu } = useMenu();
    const POKE_DIMENSIONI = menu?.POKE_DIMENSIONI ?? [];
    const BOBA_CATEGORIE = menu?.BOBA_CATEGORIE ?? [];
    const SNACKS_LISTA = menu?.SNACKS_LISTA ?? [];
    const BEVANDE_LISTA = menu?.BEVANDE_LISTA ?? [];

    const [step, setStep] = useState(() => readCart()?.step ?? "ordina");
    const [items, setItems] = useState(() => readCart()?.items ?? []);
    const [modal, setModal] = useState(null);
    const [cliente, setCliente] = useState(
        () =>
            readCart()?.cliente ?? {
                nome: "",
                telefono: "",
                orario_ritiro: "",
                note: "",
            },
    );

    const headerRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(120);
    useEffect(() => {
        if (!headerRef.current) return;
        const ro = new ResizeObserver(() => {
            setHeaderHeight(headerRef.current.offsetHeight);
        });
        ro.observe(headerRef.current);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        if (step === "conferma") {
            clearCart();
        } else {
            writeCart(items, cliente, step);
        }
    }, [items, cliente, step]);

    const { sections, active, sectionRefs, tabRefs, scrollToSection } =
        useMenuNav(headerHeight);

    const totaleItems = items.reduce((s, it) => s + (it.quantita ?? 1), 0);

    const reset = () => {
        setStep("ordina");
        setItems([]);
        setCliente({ nome: "", telefono: "", orario_ritiro: "", note: "" });
        clearCart();
    };

    const canonicalKey = (item) => {
        const normalize = (val) => {
            if (Array.isArray(val)) return [...val].sort().map(normalize);
            if (val && typeof val === "object")
                return Object.fromEntries(
                    Object.keys(val)
                        .sort()
                        .map((k) => [k, normalize(val[k])]),
                );
            return val;
        };
        return JSON.stringify({
            tipo: item.tipo,
            nome: item.nome,
            configurazione: normalize(item.configurazione),
        });
    };

    const addItem = (item) => {
        if (modal?.editingIdx != null) {
            replaceItem(modal.editingIdx, item);
        } else {
            setItems((prev) => {
                const key = canonicalKey(item);
                const existingIdx = prev.findIndex(
                    (it) => canonicalKey(it) === key,
                );
                if (existingIdx >= 0) {
                    return prev.map((it, i) =>
                        i === existingIdx
                            ? {
                                  ...it,
                                  quantita:
                                      (it.quantita ?? 1) + (item.quantita ?? 1),
                              }
                            : it,
                    );
                }
                return [...prev, item];
            });
            setModal(null);
        }
    };

    const removeItem = (idx) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    const replaceItem = (idx, item) => {
        setItems((prev) => prev.map((it, i) => (i === idx ? item : it)));
        setModal(null);
    };

    const editItem = (idx) => {
        const item = items[idx];
        if (item.tipo === "poke") {
            const dimensione = POKE_DIMENSIONI.find(
                (d) => d.id === item.configurazione.dimensione,
            );
            setModal({
                type: "poke",
                payload: { dimensione },
                editingIdx: idx,
                initialConfig: item.configurazione,
                initialQuantita: item.quantita,
            });
        } else if (item.tipo === "bubbletea") {
            const cat = BOBA_CATEGORIE.find((c) => c.id === item.categoria);
            const bobaItem = cat?.items.find((i) => i.nome === item.nome);
            setModal({
                type: "boba",
                payload: { item: bobaItem, categoria: item.categoria },
                editingIdx: idx,
                initialConfig: item.configurazione,
                initialQuantita: item.quantita,
            });
        } else if (item.tipo === "sfizio") {
            const sfizio = SNACKS_LISTA.find((s) => s.nome === item.nome);
            setModal({
                type: "sfizio",
                payload: { sfizio },
                editingIdx: idx,
                initialConfig: item.configurazione,
                initialQuantita: item.quantita,
            });
        }
    };

    const addSfizioDirect = (sfizio) => {
        const op = sfizio.opzioni[0];
        addItem({
            tipo: "sfizio",
            nome: sfizio.nome,
            image: sfizio.image,
            prezzo_base: op.prezzo,
            quantita: 1,
            configurazione: { nome: sfizio.nome, porzione: op.qty },
        });
    };

    const addBevandaDirect = (bevanda) => {
        addItem({
            tipo: "bevande",
            nome: bevanda.nome,
            image: bevanda.image,
            prezzo_base: bevanda.prezzo,
            quantita: 1,
            configurazione: { nome: bevanda.nome },
        });
    };

    const isOrdina = step === "ordina";

    if (isGiornoChiuso()) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-6 text-center gap-6">
                <img
                    src="/images/logo.svg"
                    alt="MeeTea&Poke"
                    className="h-12 w-auto"
                />
                <h1 className="text-2xl font-bold text-stone-800">
                    Oggi siamo chiusi
                </h1>
                <p className="text-stone-500 max-w-xs">
                    Il giovedì non è possibile ordinare da asporto. Torna a
                    trovarci un altro giorno!
                </p>
                <Link
                    to="/"
                    className="rounded-2xl bg-mint-600 px-6 py-3 text-white font-semibold hover:bg-mint-700 transition"
                >
                    Torna alla home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-x-clip bg-stone-50 font-sans">
            <header
                ref={headerRef}
                className="sticky top-0 z-40 bg-white shadow-sm"
            >
                <div
                    className={`mx-auto grid max-w-2xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-3`}
                >
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
                    <button
                        type="button"
                        onClick={() => setStep("riepilogo")}
                        aria-label={`Carrello${totaleItems ? `, ${totaleItems} articoli` : ""}`}
                        className="relative inline-flex h-10 w-10 items-center justify-center justify-self-end rounded-full text-stone-700 transition hover:bg-stone-100"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                        >
                            <circle cx="9" cy="20" r="1.5" />
                            <circle cx="17" cy="20" r="1.5" />
                            <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.5L21 8H6" />
                        </svg>
                        {totaleItems > 0 && (
                            <span
                                aria-hidden="true"
                                className="absolute -top-0.5 -right-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-mint-700 px-1 text-[11px] font-semibold leading-none text-white"
                            >
                                {totaleItems}
                            </span>
                        )}
                    </button>
                </div>
                <div
                    className={`mx-auto ${isOrdina ? "max-w-7xl lg:max-w-screen-2xl" : "max-w-2xl"} px-6 pb-3`}
                >
                    <ProgressBar step={step} />
                </div>
                {isOrdina && (
                    <CategoryNav
                        sections={sections}
                        active={active}
                        tabRefs={tabRefs}
                        onScrollToSection={scrollToSection}
                    />
                )}
            </header>

            <main
                className={`mx-auto ${isOrdina ? "max-w-7xl lg:max-w-screen-2xl" : "max-w-2xl"} px-6`}
            >
                {isOrdina && (
                    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-8 lg:items-start">
                        <StepOrdina
                            sections={sections}
                            sectionRefs={sectionRefs}
                            headerHeight={headerHeight}
                            onOpenModal={setModal}
                            onAddSfizioDirect={addSfizioDirect}
                            onAddBevandaDirect={addBevandaDirect}
                        />
                        <CartSidebar
                            items={items}
                            onRemove={removeItem}
                            onProcedi={() => setStep("riepilogo")}
                            headerHeight={headerHeight}
                        />
                    </div>
                )}

                {step === "riepilogo" && (
                    <div className="py-8">
                        <StepRiepilogo
                            items={items}
                            onRemove={removeItem}
                            onEdit={editItem}
                            onAddAnother={() => setStep("ordina")}
                            onProcedi={() => setStep("dati")}
                        />
                    </div>
                )}

                {step === "dati" && (
                    <div className="py-8">
                        <StepDatiCliente
                            cliente={cliente}
                            onChange={setCliente}
                            onIndietro={() => setStep("riepilogo")}
                            onProcedi={() => setStep("conferma")}
                        />
                    </div>
                )}

                {step === "conferma" && (
                    <div className="py-8">
                        <StepConferma
                            items={items}
                            cliente={cliente}
                            onReset={reset}
                        />
                    </div>
                )}
            </main>

            {modal?.type === "poke" && (
                <PokeModal
                    key={`poke-${modal.editingIdx ?? "new"}-${modal.payload.dimensione.id}`}
                    open
                    dimensione={modal.payload.dimensione}
                    onClose={() => setModal(null)}
                    onAdd={addItem}
                    initialConfig={modal.initialConfig}
                    initialQuantita={modal.initialQuantita}
                />
            )}
            {modal?.type === "boba" && (
                <BobaModal
                    key={`boba-${modal.editingIdx ?? "new"}-${modal.payload.categoria}-${modal.payload.item.nome}`}
                    open
                    item={modal.payload.item}
                    categoria={modal.payload.categoria}
                    onClose={() => setModal(null)}
                    onAdd={addItem}
                    initialConfig={modal.initialConfig}
                    initialQuantita={modal.initialQuantita}
                />
            )}
            {modal?.type === "sfizio" && (
                <SfizioModal
                    key={`sfizio-${modal.editingIdx ?? "new"}-${modal.payload.sfizio.nome}`}
                    open
                    sfizio={modal.payload.sfizio}
                    onClose={() => setModal(null)}
                    onAdd={addItem}
                    initialConfig={modal.initialConfig}
                    initialQuantita={modal.initialQuantita}
                />
            )}
        </div>
    );
}
