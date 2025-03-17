import axios from 'axios';

const BaseApi = axios.create({
    baseURL: `http://127.0.0.1:3000/`, // Backend API URL
    withCredentials: true
});

BaseApi.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default BaseApi;