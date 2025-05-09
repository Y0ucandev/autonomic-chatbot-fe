import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { api } from '../config/api';

const apiInterceptor: AxiosInstance = axios.create({
    baseURL: `${api.apiInterceptor}`,
});

let requestInterceptorId: number | null = null;

export const setupInterceptors = (token: string | null) => {
    if (requestInterceptorId !== null) {
        apiInterceptor.interceptors.request.eject(requestInterceptorId);
        requestInterceptorId = null;
    }

    requestInterceptorId = apiInterceptor.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            if (token) {
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};
export default apiInterceptor;