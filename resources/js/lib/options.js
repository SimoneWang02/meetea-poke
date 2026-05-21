export const POKE_DIMENSIONI = [
    {
        id: "small",
        nome: "Small",
        prezzo: 9.9,
        proteine: 1,
        green: 3,
        crispy: 1,
        salse: 1,
    },
    {
        id: "regular",
        nome: "Regular",
        prezzo: 11.9,
        proteine: 2,
        green: 4,
        crispy: 2,
        salse: 2,
    },
    {
        id: "large",
        nome: "Large",
        prezzo: 13.9,
        proteine: 3,
        green: 5,
        crispy: 3,
        salse: 3,
    },
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
    proteine: 1.8,
    green: 1.2,
    crispy: 0.3,
    salse: 1.3,
};

export const BOBA_CATEGORIE = [
    {
        id: "te-latte",
        titolo: "Tè al Latte",
        sizes: ["M", "G"],
        items: [
            { nome: "Bubble Tea Nero", prezzi: { M: 4, G: 5 } },
            { nome: "Bubble Tea Verde", prezzi: { M: 4, G: 5 } },
            { nome: "Bubble Tea con Cappuccino", prezzi: { M: 4, G: 5 } },
            { nome: "Bubble Tea al Taro", prezzi: { M: 4, G: 5 } },
            { nome: "Bubble Tea con Caramel", prezzi: { M: 4, G: 5 } },
            { nome: "Bubble Tea ai Fagioli Rossi", prezzi: { M: 4, G: 5 } },
            { nome: "Bubble Tea al Cioccolato", prezzi: { M: 4, G: 5 } },
            { nome: "Latte al Cocco", prezzi: { M: 4.5, G: 5.5 } },
            { nome: "Latte di Cocco con Mango", prezzi: { M: 4.5, G: 5.5 } },
            { nome: "Latte di Cocco con Taro", prezzi: { M: 4.5, G: 5.5 } },
            { nome: "Latte di Cocco con Grano", prezzi: { M: 4.5, G: 5.5 } },
            { nome: "Bubble Tea Matcha", prezzi: { M: 4.5, G: 5.5 } },
            { nome: "Zucchero Tostato", prezzi: { M: 4.5, G: 5.5 } },
        ],
    },
    {
        id: "te-latte-frutta",
        titolo: "Tè al Latte con Aroma Frutta",
        sizes: ["M", "G"],
        items: [
            { nome: "Bubble Tea alla Fragola", prezzi: { M: 4, G: 5 } },
            { nome: "Bubble Tea al Mango", prezzi: { M: 4, G: 5 } },
            { nome: "Bubble Tea alla Vaniglia", prezzi: { M: 4, G: 5 } },
            { nome: "Bubble Tea alla Banana", prezzi: { M: 4, G: 5 } },
            { nome: "Bubble Tea alla Papaya", prezzi: { M: 4, G: 5 } },
            { nome: "Bubble Tea ai Litchi", prezzi: { M: 4, G: 5 } },
            { nome: "Bubble Tea all'Anguria", prezzi: { M: 4, G: 5 } },
            { nome: "Bubble Tea al Mirtillo", prezzi: { M: 4, G: 5 } },
            { nome: "Bubble Tea al Melone", prezzi: { M: 4, G: 5 } },
            { nome: "Bubble Tea alla Pesca", prezzi: { M: 4, G: 5 } },
        ],
    },
    {
        id: "te-verde-nero-granita",
        titolo: "Tè Verde, Nero o Granita",
        sizes: ["M", "G"],
        items: [
            { nome: "Mango", prezzi: { M: 4, G: 5 } },
            { nome: "Fragola", prezzi: { M: 4, G: 5 } },
            { nome: "Ananas", prezzi: { M: 4, G: 5 } },
            { nome: "Anguria", prezzi: { M: 4, G: 5 } },
            { nome: "Mela Verde", prezzi: { M: 4, G: 5 } },
            { nome: "Melone", prezzi: { M: 4, G: 5 } },
            { nome: "Red Guava", prezzi: { M: 4, G: 5 } },
            { nome: "Menta", prezzi: { M: 4, G: 5 } },
            { nome: "Mirtillo", prezzi: { M: 4, G: 5 } },
            { nome: "Kiwi", prezzi: { M: 4, G: 5 } },
            { nome: "Miele", prezzi: { M: 4, G: 5 } },
            { nome: "Pesca", prezzi: { M: 4, G: 5 } },
            { nome: "Zenzero", prezzi: { M: 4, G: 5 } },
            { nome: "Uva", prezzi: { M: 4, G: 5 } },
            { nome: "Gelso", prezzi: { M: 4, G: 5 } },
            { nome: "Ciliegia", prezzi: { M: 4, G: 5 } },
            { nome: "Litchi", prezzi: { M: 4, G: 5 } },
            { nome: "Limone", prezzi: { M: 4, G: 5 } },
            { nome: "Maracuja", prezzi: { M: 4, G: 5 } },
            { nome: "Cocco", prezzi: { M: 4, G: 5 } },
            { nome: "Lampone", prezzi: { M: 4, G: 5 } },
            { nome: "Arancia", prezzi: { M: 4, G: 5 } },
            { nome: "Pompelmo", prezzi: { M: 4, G: 5 } },
            { nome: "Banana", prezzi: { M: 4, G: 5 } },
            { nome: "Papaya", prezzi: { M: 4, G: 5 } },
        ],
    },
    {
        id: "speciali-senza-latte",
        titolo: "Bubble Tea Speciali (Senza Latte)",
        sizes: ["G"],
        items: [
            {
                nome: "Tè Limone alla Fragola",
                prezzi: { G: 5.5 },
                ingredienti: "Tè verde, fette di limone, fragola fresca",
            },
            {
                nome: "Tè Limone con Pesca",
                prezzi: { G: 5.5 },
                ingredienti: "Tè verde, aroma di pesca, pesca e limone freschi",
            },
            {
                nome: "Passion Fruit all'Ananas",
                prezzi: { G: 5.5 },
                ingredienti: "Tè verde, passion fruit e ananas freschi",
                topSeller: true,
            },
            {
                nome: "Passion Fruit al Mango",
                prezzi: { G: 5.5 },
                ingredienti: "Tè verde, passion fruit e mango freschi",
            },
            { nome: "Passion Fruit al Mojito", prezzi: { G: 5.5 } },
            {
                nome: "I Miss You",
                prezzi: { G: 5.5 },
                ingredienti:
                    "Latte probiotico gusto tropical con panna montata",
            },
            {
                nome: "Yakult alla Fragola",
                prezzi: { G: 5.5 },
                ingredienti: "Latte probiotico, fragola fresca",
            },
            {
                nome: "Tè Verde Miele e Pompelmo",
                prezzi: { G: 5.5 },
                ingredienti:
                    "Tè verde, miele, pompelmo e fette di limone fresco",
            },
            {
                nome: "Yakult all'Ananas",
                prezzi: { G: 5.5 },
                ingredienti: "Latte probiotico, ananas fresca",
            },
            {
                nome: "Yakult all'Arancia",
                prezzi: { G: 5.5 },
                ingredienti: "Latte probiotico, arancia fresca",
            },
            { nome: "Anguria Fresca al Cocco", prezzi: { G: 5.5 } },
            { nome: "Tè all'Arancia Fresca con Maracuja", prezzi: { G: 5.5 } },
        ],
    },
    {
        id: "speciali-con-latte",
        titolo: "Bubble Tea Speciali (Con Latte)",
        sizes: ["G"],
        items: [
            {
                nome: "Latte di Cocco con Matcha",
                prezzi: { G: 5.5 },
                ingredienti: "Latte di cocco, matcha",
            },
            {
                nome: "Oreo",
                prezzi: { G: 5.5 },
                ingredienti: "Tè nero, latte, biscotti Oreo, panna montata",
            },
            {
                nome: "Tè Sporco Originale",
                prezzi: { G: 5 },
                ingredienti: "Tè verde, latte, zucchero di canna",
            },
            {
                nome: "Fragola Tricolore",
                prezzi: { G: 5.5 },
                ingredienti: "Marmellata di fragole, latte, fiore blu",
            },
            {
                nome: "Matcha e Fragola con Latte",
                prezzi: { G: 6 },
                ingredienti: "Latte, fragole, panna montata al matcha",
            },
            {
                nome: "Tè Sporco alla Patata Dolce",
                prezzi: { G: 5.5 },
                ingredienti: "Marmellata di patata dolce, latte",
            },
            {
                nome: "Tè Sporco al Matcha",
                prezzi: { G: 5.5 },
                ingredienti: "Marmellata di matcha, latte",
            },
            {
                nome: "Latte di Cocco Denso con Caffè",
                prezzi: { G: 5.5 },
                ingredienti: "Latte di cocco, caffè",
                topSeller: true,
            },
            {
                nome: "Tè Sporco al Mango",
                prezzi: { G: 5.5 },
                ingredienti: "Marmellata di mango con pezzetti, latte",
            },
            {
                nome: "Tè Sporco alla Fragola",
                prezzi: { G: 5.5 },
                ingredienti: "Marmellata di fragola con pezzetti, latte",
            },
            { nome: "Red Bean con Pudino", prezzi: { G: 5.5 } },
            { nome: "Latte di Cocco Denso al Mango", prezzi: { G: 5.5 } },
        ],
    },
    {
        id: "speciali-granite",
        titolo: "Bubble Tea Speciali (Granite)",
        sizes: ["G"],
        items: [
            {
                nome: "Cheese Fragola",
                prezzi: { G: 5.5 },
                ingredienti:
                    "Granita alla fragola, frutta secca, panna montata",
            },
            {
                nome: "Cheese Uva",
                prezzi: { G: 5.5 },
                ingredienti: "Granita all'uva, frutta secca, panna montata",
            },
            {
                nome: "Ananas Fresca in Granita",
                prezzi: { G: 5.5 },
                ingredienti: "Granita all'ananas, frutta secca",
            },
            { nome: "Red Bean Matcha", prezzi: { G: 5.5 } },
            { nome: "Cheese Dragon", prezzi: { G: 5.5 } },
            { nome: "Cheese Mango", prezzi: { G: 5.5 }, topSeller: true },
        ],
    },
];

export const BOBA_TOPPING = {
    singoli: [
        { nome: "Perle di Tapioca", prezzo: 0.5 },
        { nome: "Jelly Erba", prezzo: 0.5 },
        { nome: "Granella di Oreo", prezzo: 0.5 },
        { nome: "Tapioca Trasparente", prezzo: 1 },
        { nome: "Cheese Cream", prezzo: 1 },
    ],
    gruppi: [
        {
            nome: "Gelatine",
            prezzo: 0.5,
            gusti: ["Miste", "Mela", "Litchi", "Cocco", "Fragola"],
        },
        {
            nome: "Palline",
            prezzo: 0.5,
            gusti: [
                "Limone",
                "Litchi",
                "Ciliegia",
                "Lampone",
                "Maracuja",
                "Ananas",
                "Fragola",
                "Uva",
                "Pesca",
                "Mirtillo",
                "Mela",
                "Melograno",
                "Mango",
            ],
        },
    ],
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

export const SNACKS_LISTA = [
    {
        nome: "Zuppa di Suino",
        image: "zuppa_suino.JPG",
        opzioni: [
            { qty: "Porzione Piccola", prezzo: 3.5 },
            { qty: "Porzione Grande", prezzo: 5 },
        ],
    },
    {
        nome: "Ravioli di Carne",
        image: "ravioli_carne.JPG",
        opzioni: [{ qty: "6pz", prezzo: 4 }],
    },
    {
        nome: "Ravioli di Gamberi",
        image: "ravioli_gamberi.JPG",
        opzioni: [{ qty: "4pz", prezzo: 5 }],
    },
    {
        nome: "Tortellini Cinesi",
        image: "tortellini_cinesi.JPG",
        opzioni: [{ qty: "10pz", prezzo: 5 }],
    },
    {
        nome: "Pollo Riempito con Riso",
        image: "pollo_riempito.JPG",
        opzioni: [{ qty: "1pz", prezzo: 4.5 }],
    },
    {
        nome: "Panino Maialino",
        image: "panino_maialino.JPG",
        opzioni: [{ qty: "4pz", prezzo: 5 }],
    },
    {
        nome: "Popcorn Chicken",
        image: "popcorn_chicken.JPG",
        opzioni: [{ qty: "1 Porzione", prezzo: 3.5 }],
    },
    {
        nome: "Strisce di Pollo",
        image: "strisce_pollo.JPG",
        opzioni: [{ qty: "1 Porzione", prezzo: 3.5 }],
    },
    {
        nome: "Pollo Fritto",
        image: null,
        opzioni: [{ qty: "4pz", prezzo: 5 }],
    },
    {
        nome: "Hot Dog",
        image: "hot_dog.JPG",
        opzioni: [{ qty: "1 Porzione", prezzo: 2 }],
    },
    {
        nome: "Takoyaki",
        image: "takoyaki.JPG",
        opzioni: [
            { qty: "4pz", prezzo: 4 },
            { qty: "6pz", prezzo: 5.5 },
        ],
    },
    {
        nome: "Cheese Panino",
        image: null,
        opzioni: [{ qty: "1pz", prezzo: 4.5 }],
    },
    {
        nome: "Gambero Tempura",
        image: "tempura_gamberi.JPG",
        opzioni: [{ qty: "4pz", prezzo: 5 }],
    },
    {
        nome: "Dorayaki",
        image: "dorayaki.JPG",
        opzioni: [{ qty: "1pz", prezzo: 2 }],
    },
    {
        nome: "Mochi",
        image: "mochi.JPG",
        opzioni: [
            { qty: "1pz", prezzo: 2 },
            { qty: "2pz", prezzo: 4.5 },
            { qty: "3pz", prezzo: 6 },
        ],
    },
];
