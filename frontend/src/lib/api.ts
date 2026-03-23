import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/', // Added trailing slash
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // For Sanctum Cookie Auth if used, or plain Token Auth
});

// Add a request interceptor to attach the token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
