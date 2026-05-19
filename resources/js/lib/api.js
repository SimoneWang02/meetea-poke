import axios from '../bootstrap';

export async function createOrder(payload) {
    const { data } = await axios.post('/orders', payload);
    return data;
}

export async function adminLogin(password) {
    const { data } = await axios.post('/admin/login', { password });
    return data;
}

export async function listOrders(token) {
    const { data } = await axios.get('/orders', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
}

export async function updateStato(token, orderId, stato) {
    const { data } = await axios.patch(
        `/orders/${orderId}/stato`,
        { stato },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
}
