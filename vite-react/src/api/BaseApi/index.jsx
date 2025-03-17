import axios from 'axios';

const BaseApi = axios.create({
    baseURL: `http://127.0.0.1:3000/`, // Backend API URL
    withCredentials: true // ✅ Ensures cookies are sent with every request
});

// Debugging: Log headers to check if cookies are sent
BaseApi.interceptors.request.use((config) => {
    console.log('Request Headers:', config.headers);
    console.log('With Credentials:', config.withCredentials);
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default BaseApi;