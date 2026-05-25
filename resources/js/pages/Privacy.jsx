import React from "react";
import { Link } from "react-router-dom";
import { CONTATTI } from "../lib/options";

const Section = ({ title, children }) => (
    <section className="mt-8">
        <h2 className="text-base font-semibold text-stone-800">{title}</h2>
        <div className="mt-2 space-y-2 text-sm text-stone-600 leading-relaxed">
            {children}
        </div>
    </section>
);

export default function Privacy() {
    return (
        <div className="min-h-screen bg-stone-50 font-sans">
            <header className="sticky top-0 z-40 bg-white shadow-sm">
                <div className="mx-auto grid max-w-2xl grid-cols-[1fr_auto_1fr] items-center px-6 py-3">
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
                        <span className="text-sm font-medium">Indietro</span>
                    </Link>
                    <Link to="/" className="flex justify-center">
                        <img
                            src="/images/logo.svg"
                            alt="MeeTea&Poke"
                            className="h-10 w-auto"
                        />
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-2xl px-6 py-10 pb-20">
                <h1 className="text-2xl font-bold tracking-tight text-stone-900">
                    Informativa sulla Privacy
                </h1>
                <p className="mt-1 text-xs text-stone-400">
                    Ai sensi dell'art. 13 del Regolamento UE 2016/679 (GDPR)
                </p>

                <Section title="Titolare del trattamento">
                    <p>
                        <strong>MeeTea &amp; Poke</strong>
                        <br />
                        {CONTATTI.indirizzo}
                        <br />
                        Tel. {CONTATTI.telefono}
                        <br />
                        Email:{" "}
                        <a
                            href="mailto:qqtea2020@gmail.com"
                            className="text-mint-700 underline hover:text-mint-800"
                        >
                            qqtea2020@gmail.com
                        </a>
                    </p>
                </Section>

                <Section title="Dati raccolti e finalità">
                    <p>
                        In fase di ordine raccogliamo <strong>nome</strong> e{" "}
                        <strong>numero di telefono</strong>. Questi dati vengono
                        usati esclusivamente per:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            identificare il cliente al momento del ritiro
                            dell'ordine;
                        </li>
                        <li>
                            contattarti in caso di necessità legate all'ordine.
                        </li>
                    </ul>
                    <p>
                        I dati non vengono usati per finalità di marketing,
                        profilazione o comunicati a terzi.
                    </p>
                </Section>

                <Section title="Base giuridica">
                    <p>
                        Il trattamento è necessario all'esecuzione del contratto
                        di cui sei parte (art. 6 §1 lett. b GDPR) - senza questi
                        dati non è possibile gestire il tuo ordine.
                    </p>
                </Section>

                <Section title="Conservazione">
                    <p>
                        I dati vengono conservati per il tempo strettamente
                        necessario alla gestione dell'ordine e rimossi entro 30
                        giorni dal ritiro.
                    </p>
                </Section>

                <Section title="I tuoi diritti">
                    <p>
                        Hai diritto di accedere ai tuoi dati, richiederne la
                        rettifica o la cancellazione, opporti al trattamento e,
                        dove applicabile, richiedere la portabilità. Puoi
                        esercitare questi diritti scrivendo a{" "}
                        <a
                            href="mailto:qqtea2020@gmail.com"
                            className="text-mint-700 underline hover:text-mint-800"
                        >
                            qqtea2020@gmail.com
                        </a>
                        . Hai inoltre il diritto di proporre reclamo al Garante
                        per la Protezione dei Dati Personali (
                        <span className="font-medium">
                            www.garanteprivacy.it
                        </span>
                        ).
                    </p>
                </Section>

                <div className="mt-10 rounded-2xl bg-white px-6 py-4 ring-1 ring-stone-200 text-xs text-stone-400">
                    Ultimo aggiornamento: maggio 2025
                </div>
            </main>
        </div>
    );
}
