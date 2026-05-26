export const ORARI_APERTURA = [
    { giorno: "Lunedì", orario: "10:30 - 22:30" },
    { giorno: "Martedì", orario: "10:30 - 22:30" },
    { giorno: "Mercoledì", orario: "10:30 - 22:30" },
    { giorno: "Giovedì", orario: "Chiuso" },
    { giorno: "Venerdì", orario: "10:30 - 22:30" },
    { giorno: "Sabato", orario: "10:30 - 22:30" },
    { giorno: "Domenica", orario: "10:30 - 22:30" },
];

const GIORNI_JS = [
    "Domenica",
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
];

export function isGiornoChiuso() {
    const oggi = GIORNI_JS[new Date().getDay()];
    return ORARI_APERTURA.find((o) => o.giorno === oggi)?.orario === "Chiuso";
}

export function generateSlotsRitiro() {
    const slots = [];
    for (let h = 11; h <= 22; h++) {
        for (let m = 0; m < 60; m += 15) {
            if (h === 22 && m >= 30) break;
            const hh = String(h).padStart(2, "0");
            const mm = String(m).padStart(2, "0");
            slots.push(`${hh}:${mm}`);
        }
    }
    return slots;
}

export const CONTATTI = {
    telefono: "+39 333 506 8836",
    telefonoTel: "+393335068836",
    indirizzo: "Piazzale Dante Alighieri 6, 41012 Carpi (MO)",
    mapsUrl:
        "https://www.google.com/maps/dir/?api=1&destination=" +
        encodeURIComponent(
            "QQ Tea Taiwan Bubble Tea, Piazzale Dante Alighieri, 6, 41012 Carpi MO",
        ),
    instagram: "https://instagram.com/meetea_poke",
    instagramHandle: "@meetea_poke",
};
