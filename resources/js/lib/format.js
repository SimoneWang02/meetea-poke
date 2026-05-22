export function formatPrezzo(n) {
    return n.toFixed(2).replace(".", ",") + " €";
}
