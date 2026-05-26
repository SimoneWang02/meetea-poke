const CART_KEY = 'mtp.cart.v1';
const CART_TTL_MS = 4 * 60 * 60 * 1000;

export function readCart() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed?.savedAt || !Array.isArray(parsed.items)) return null;
        if (Date.now() - parsed.savedAt > CART_TTL_MS) return null;
        return { items: parsed.items, cliente: parsed.cliente, step: parsed.step };
    } catch {
        return null;
    }
}

export function writeCart(items, cliente, step) {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify({ items, cliente, step, savedAt: Date.now() }));
    } catch {}
}

export function clearCart() {
    try {
        localStorage.removeItem(CART_KEY);
    } catch {}
}
