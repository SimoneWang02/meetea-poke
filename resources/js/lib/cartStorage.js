const CART_KEY = 'mtp.cart.v1';
const CART_TTL_MS = 4 * 60 * 60 * 1000;

const CONFIRMED_ORDER_KEY = 'mtp.confirmedOrder.v1';
const CONFIRMED_ORDER_TTL_MS = 4 * 60 * 60 * 1000;

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

export function readConfirmedOrder() {
    try {
        const raw = localStorage.getItem(CONFIRMED_ORDER_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed?.savedAt || !parsed.result) return null;
        if (Date.now() - parsed.savedAt > CONFIRMED_ORDER_TTL_MS) return null;
        return { result: parsed.result, items: parsed.items ?? [], note: parsed.note ?? '' };
    } catch {
        return null;
    }
}

export function writeConfirmedOrder(result, items, note) {
    try {
        localStorage.setItem(
            CONFIRMED_ORDER_KEY,
            JSON.stringify({ result, items, note, savedAt: Date.now() }),
        );
    } catch {}
}

export function clearConfirmedOrder() {
    try {
        localStorage.removeItem(CONFIRMED_ORDER_KEY);
    } catch {}
}
