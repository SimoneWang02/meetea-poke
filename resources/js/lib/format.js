const FMT = new Intl.NumberFormat("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatNumero(n) {
    return FMT.format(n);
}

export function formatPrezzo(n) {
    return FMT.format(n) + " €";
}
