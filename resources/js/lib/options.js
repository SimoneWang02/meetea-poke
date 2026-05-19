export const POKE_BASI = ["riso bianco", "riso integrale", "mix insalata"];
export const POKE_PROTEINE = ["salmone", "tonno", "pollo", "tofu"];
export const POKE_TOPPING = [
    "edamame",
    "avocado",
    "mango",
    "cipollotto",
    "cetriolo",
    "carota",
    "mais",
];
export const POKE_SALSE = ["shoyu", "spicy mayo", "teriyaki", "ponzu"];
export const POKE_MAX_TOPPING = 4;

export const TEA_BASI = ["tè nero", "tè verde", "taro", "matcha"];
export const TEA_LATTE = ["con latte", "senza latte"];
export const TEA_PEARLS = [
    "tapioca classica",
    "popping boba fragola",
    "nessuna",
];
export const TEA_DOLCEZZA = ["0%", "25%", "50%", "75%", "100%"];
export const TEA_GHIACCIO = ["no ghiaccio", "poco", "normale", "tanto"];

export const ORARI_APERTURA = [
    { giorno: "Lunedì", orario: "10:00 – 22:30" },
    { giorno: "Martedì", orario: "10:00 – 22:30" },
    { giorno: "Mercoledì", orario: "10:00 – 22:30" },
    { giorno: "Giovedì", orario: "chiuso" },
    { giorno: "Venerdì", orario: "10:00 – 22:30" },
    { giorno: "Sabato", orario: "10:00 – 22:30" },
    { giorno: "Domenica", orario: "10:00 – 22:30" },
];

export function generateSlotsRitiro() {
    const slots = [];
    for (let h = 10; h <= 22; h++) {
        for (let m = 0; m < 60; m += 15) {
            if (h === 22 && m > 30) break;
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
        "https://www.google.com/maps/place/QQ+Tea+Taiwan+Bubble+Tea/@44.783076,10.8880567,87m/data=!3m1!1e3!4m15!1m8!3m7!1s0x477f8d35e8cc996f:0xf0263c60bbda4526!2sPiazzale+Dante+Alighieri,+6,+41012+Carpi+MO!3b1!8m2!3d44.782961!4d10.888387!16s%2Fg%2F11vhfgy7mp!3m5!1s0x477f8d2e91c553a1:0xf14e719184039881!8m2!3d44.7829379!4d10.8882007!16s%2Fg%2F11fr3gwqkf!5m1!1e2?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D",
    instagram: "https://instagram.com/meetea_poke",
    instagramHandle: "@meetea_poke",
};
