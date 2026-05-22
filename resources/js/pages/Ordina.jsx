import React, { useState } from "react";
import { Link } from "react-router-dom";
import StepOrdina from "../components/steps/StepOrdina";
import StepRiepilogo from "../components/steps/StepRiepilogo";
import StepDatiCliente from "../components/steps/StepDatiCliente";
import StepConferma from "../components/steps/StepConferma";
import PokeModal from "../components/order/PokeModal";
import BobaModal from "../components/order/BobaModal";
import SfizioModal from "../components/order/SfizioModal";

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
        <ol className="grid grid-cols-4 gap-2">
            {STEPS_LABELS.map((label, idx) => {
                const active = idx <= current;
                return (
                    <li key={label} className="flex flex-col items-center">
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
                );
            })}
        </ol>
    );
}

export default function Ordina() {
    const [step, setStep] = useState("ordina");
    const [items, setItems] = useState([]);
    const [modal, setModal] = useState(null);
    const [cliente, setCliente] = useState({
        nome: "",
        telefono: "",
        orario_ritiro: "",
        note: "",
    });

    const totaleItems = items.reduce((s, it) => s + (it.quantita ?? 1), 0);

    const reset = () => {
        setStep("ordina");
        setItems([]);
        setCliente({ nome: "", telefono: "", orario_ritiro: "", note: "" });
    };

    const addItem = (item) => {
        setItems((prev) => [...prev, item]);
        setModal(null);
    };

    const removeItem = (idx) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    const addSfizioDirect = (sfizio) => {
        const op = sfizio.opzioni[0];
        addItem({
            tipo: "sfizio",
            nome: sfizio.nome,
            image: sfizio.image,
            prezzo_base: op.prezzo,
            quantita: 1,
            configurazione: { porzione: op.qty },
        });
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans">
            <header className="sticky top-0 z-40 bg-white shadow-sm">
                <div className="mx-auto grid max-w-2xl grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-3">
                    <Link
                        to="/"
                        aria-label="Torna alla home"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-700"
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
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </Link>
                    <Link to="/" className="flex justify-center">
                        <img
                            src="/images/logo.PNG"
                            alt="MeeTea & Poke"
                            className="h-10 w-auto"
                        />
                    </Link>
                    <button
                        type="button"
                        onClick={() => setStep("riepilogo")}
                        aria-label={`Carrello${totaleItems ? `, ${totaleItems} articoli` : ""}`}
                        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100"
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
                <div className="mx-auto max-w-2xl px-6 pb-3">
                    <ProgressBar step={step} />
                </div>
            </header>

            <main className="mx-auto max-w-2xl px-6">
                {step === "ordina" && (
                    <StepOrdina
                        onOpenModal={setModal}
                        onAddSfizioDirect={addSfizioDirect}
                    />
                )}

                {step === "riepilogo" && (
                    <div className="py-8">
                        <StepRiepilogo
                            items={items}
                            onRemove={removeItem}
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
                    key={`poke-${modal.payload.dimensione.id}`}
                    open
                    dimensione={modal.payload.dimensione}
                    onClose={() => setModal(null)}
                    onAdd={addItem}
                />
            )}
            {modal?.type === "boba" && (
                <BobaModal
                    key={`boba-${modal.payload.categoria}-${modal.payload.item.nome}`}
                    open
                    item={modal.payload.item}
                    categoria={modal.payload.categoria}
                    onClose={() => setModal(null)}
                    onAdd={addItem}
                />
            )}
            {modal?.type === "sfizio" && (
                <SfizioModal
                    key={`sfizio-${modal.payload.sfizio.nome}`}
                    open
                    sfizio={modal.payload.sfizio}
                    onClose={() => setModal(null)}
                    onAdd={addItem}
                />
            )}
        </div>
    );
}
