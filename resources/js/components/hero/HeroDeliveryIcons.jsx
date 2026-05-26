import React from "react";

const DELIVEROO_URL =
    "https://deliveroo.it/it/menu/carpi/carpi/meerei-and-poke";
const GLOVO_URL = "https://glovoapp.com/it/it/carpi/stores/meeteapoke-crp";

export default function HeroDeliveryIcons({ tone = "light" }) {
    const labelClass = tone === "dark" ? "text-stone-600" : "text-white/85";

    return (
        <div className="flex flex-col items-center gap-5">
            <span
                className={`text-xs font-semibold uppercase tracking-[0.2em] ${labelClass}`}
            >
                Oppure ordina a domicilio su
            </span>
            <div className="flex items-center gap-4">
                <a
                    href={DELIVEROO_URL}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Ordina su Deliveroo"
                    title="Ordina su Deliveroo"
                    className="group flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-stone-900/15 transition hover:-translate-y-0.5 hover:shadow-xl"
                    style={{ backgroundColor: "#00CCBC" }}
                >
                    <img
                        src="/images/homepage/deliveroo.svg"
                        alt=""
                        aria-hidden="true"
                        className="h-7 w-7 transition group-hover:scale-110"
                    />
                </a>
                <a
                    href={GLOVO_URL}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Ordina su Glovo"
                    title="Ordina su Glovo"
                    className="group flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-stone-900/15 transition hover:-translate-y-0.5 hover:shadow-xl"
                    style={{ backgroundColor: "#FDC500" }}
                >
                    <img
                        src="/images/homepage/glovo.svg"
                        alt=""
                        aria-hidden="true"
                        className="h-7 w-7 transition group-hover:scale-110"
                        style={{ filter: "brightness(0) invert(1)" }}
                    />
                </a>
            </div>
        </div>
    );
}
