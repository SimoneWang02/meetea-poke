import axios from '../bootstrap';

export async function createOrder(payload) {
    const { data } = await axios.post('/orders', payload);
    return data;
}

export async function staffLogin(password) {
    const { data } = await axios.post('/staff/login', { password });
    return data;
}

export async function listOrders(token) {
    const { data } = await axios.get('/orders', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
}

