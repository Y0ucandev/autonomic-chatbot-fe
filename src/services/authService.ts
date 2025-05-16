import publicAxios from './publicAxios';
import apiInterceptor from './apiInterceptor';

type LoginCredentials = {
    email: string;
    password: string;
}

type RegisterData = {
    name: string;
    email: string;
    password: string;
    gender: string;
    age: number;
}

type AuthResponse = {
    token: string;
    user: RegisterData
}

export const register = async (userData: RegisterData) => {
    return publicAxios.post<AuthResponse>('/users/register', userData);
};

export const login = async (credentials: LoginCredentials) => {
    return publicAxios.post<AuthResponse>('/users/login', credentials);
};

export const refreshToken = async () => {
    return apiInterceptor.post<{ token: string }>('/users/refresh-token');
};

export const logout = async () => {
    try {
        await apiInterceptor.post('/users/logout');
        return true;
    } catch (error) {
        console.error('The server responded with an error:', error);
        return false;
    }
};

export const verifyToken = async () => {
    try {
        await apiInterceptor.get('/users/verify-token');
        return true;
    } catch (error) {
        return false;
    }
};