// Instance Axios partagée avec token d'authentification automatique

import axios from 'axios';

const API = axios.create({ baseURL: 'https://stageconnect-backend.onrender.com/api' });

// Houni dima nab3thou el Token kenou mawjoud
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const login = (formData: any) => API.post('/auth/login', formData);
export const register = (formData: any) => API.post('/auth/register', formData);
export const fetchOffers = () => API.get('/offers');

export default API;