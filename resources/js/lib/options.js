export const POKE_DIMENSIONI = [
    { id: "small",   nome: "Small",   prezzo: 9.90,  proteine: 1, green: 3, crispy: 1, salse: 1 },
    { id: "regular", nome: "Regular", prezzo: 11.90, proteine: 2, green: 4, crispy: 2, salse: 2 },
    { id: "large",   nome: "Large",   prezzo: 13.90, proteine: 3, green: 5, crispy: 3, salse: 3 },
];

export const POKE_BASI_MAX = 2;

export const POKE_BASI = [
    "Riso Sushi",
    "Riso Bianco",
    "Riso Integrale",
    "Riso Venere",
    "Quinoa",
    "Insalata",
];

export const POKE_PROTEINE = [
    "Salmone",
    "Tonno",
    "Salmone Marinato Spicy",
    "Salmone Cotto",
    "Tonno Cotto sott'Olio",
    "Pollo Impanato",
    "Tacchino",
    "Uova Sodo",
    "Tofu",
    "Polipo Cotto",
    "Gambero Cotto",
    "Gambero in Tempura",
];

export const POKE_GREEN = [
    "Avocado",
    "Edamame",
    "Goma Wakame",
    "Zucchine",
    "Cetrioli",
    "Carote",
    "Pomodorini",
    "Ceci",
    "Mais",
    "Ananas",
    "Mango",
    "Cavolo Viola",
    "Cipolla Rossa",
    "Germogli di Soia",
    "Zenzero Marinato",
    "Jalapenos",
    "Fagioli Rossi",
    "Olive",
    "Feta Greca",
    "Mozzarella",
    "Philadelphia",
];

export const POKE_CRISPY = [
    "Alga Nori",
    "Cipolla Fritta",
    "Sesamo",
    "Semi di Girasole",
    "Noci",
    "Arachidi",
    "Mandorle a Scaglie",
    "Granella di Pistacchio",
    "Chips di Kataifi",
    "Nachos",
    "Arachidi al Wasabi",
    "Parmigiano",
];

export const POKE_SALSE = [
    "Salsa di Soia",
    "Salsa di Soia senza Glutine",
    "Salsa Teriyaki",
    "Salsa Poke",
    "Salsa Sweet Chili",
    "Salsa Ponzu",
    "Olio Evo",
    "Guacamole",
    "Mayo Kewpie",
    "Maionese",
    "Maionese Vegana",
    "Salsa Yogurt",
    "Spicy Maionese",
    "Glassa di Aceto Balsamico",
];

export const POKE_EXTRA_PREZZI = {
    proteine: 1.80,
    green: 1.20,
    crispy: 0.30,
    salse: 1.30,
};

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
