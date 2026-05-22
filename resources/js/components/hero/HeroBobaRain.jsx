import { Link } from "react-router-dom";
import HeroDeliveryIcons from "./HeroDeliveryIcons";
import { CONTATTI } from "../../lib/options";

export default function HeroBobaRain() {
    return (
        <section className="relative flex h-screen min-h-[640px] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-mint-400 via-mint-600 to-mint-800 text-white">
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-mint-200 opacity-30 blur-3xl" />

            <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
                <img
                    src="/images/name.svg"
                    alt="MeeTea & Poke"
                    className="w-[min(90%,540px)] drop-shadow-[0_10px_30px_rgba(0,0,0,0.25)] animate-fade-in-scale"
                />
                <a
                    href={CONTATTI.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-base text-white/90 underline-offset-4 transition hover:text-white hover:underline sm:text-lg animate-fade-in-up [animation-delay:200ms]"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 shrink-0"
                    >
                        <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11Z" />
                        <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    {CONTATTI.indirizzo}
                </a>
                <a
                    href={`tel:${CONTATTI.telefonoTel}`}
                    className="mt-2 inline-flex items-center gap-2 text-base text-white/90 underline-offset-4 transition hover:text-white hover:underline sm:text-lg animate-fade-in-up [animation-delay:350ms]"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 shrink-0"
                    >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
                    </svg>
                    {CONTATTI.telefono}
                </a>

                <Link
                    to="/ordina"
                    className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-semibold text-mint-800 shadow-lg shadow-mint-900/30 transition hover:-translate-y-0.5 hover:bg-stone-50 sm:text-lg animate-fade-in-up [animation-delay:500ms]"
                >
                    Ordina da Asporto
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

                <div className="mt-5 animate-fade-in [animation-delay:650ms]">
                    <HeroDeliveryIcons tone="light" />
                </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-mint-900/30" />
        </section>
    );
}
