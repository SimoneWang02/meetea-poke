import axios from 'axios';

axios.defaults.baseURL = '/api';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
if (csrf) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf;
}

export default axios;
