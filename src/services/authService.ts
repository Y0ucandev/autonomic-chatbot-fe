import publicAxios from './publicAxios';
import apiInterceptor from './apiInterceptor';
import { decodeJWT } from '../utils/tokenUtils';

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
export type RefreshTokenResponse = {
    access_token: string;
    token_type: string;
}

export const register = async (userData: RegisterData) => {
    return publicAxios.post<AuthResponse>('/users/register', userData);
};

export const login = async (credentials: LoginCredentials) => {
    return publicAxios.post<AuthResponse>('/users/login', credentials);
};

export const refreshToken = async (currentToken: string): Promise<RefreshTokenResponse> => {
    if (!currentToken) {
        throw new Error('No token to refresh');
    }
    const decodedToken = decodeJWT(currentToken);

    if (!decodedToken) {
        throw new Error('Unable to decode token');
    }

    const response = await apiInterceptor.post<RefreshTokenResponse>('/users/refresh-token', {
        sub: decodedToken.sub,
        email: decodedToken.email,
        role: decodedToken.role,
        exp: decodedToken.exp
    });
    return response.data;
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