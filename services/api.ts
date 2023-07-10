import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.0.112/sampleapi',
    timeout: 60000,
    headers: { 
        // token: '26d7c43e-504f-4bab-8177-8392fd4839ee',
    },
});

export default api;