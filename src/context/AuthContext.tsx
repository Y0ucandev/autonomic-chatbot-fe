import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenExpired } from '../utils/tokenUtils';
import { refreshToken } from '../services/authService';
import { setupInterceptors } from '../services/apiInterceptor';
import { getUserProfile } from '../services/userService';

export type User = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    gender: string;
    age: number;
}

type AuthContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    logout: () => void;
    authenticated: boolean;
    refreshUserToken: () => Promise<boolean>;
}

const defaultAuthContext: AuthContextType = {
    user: null,
    setUser: () => { },
    loading: true,
    logout: () => { },
    authenticated: false,
    refreshUserToken: () => Promise.resolve(false)
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [token, setToken] = useState<string | null>(null);

    const logout = useCallback(() => {
        localStorage.removeItem('accessToken');
        setupInterceptors(null);
        setToken(null);
        setUser(null);
        navigate('/Logowanie');
    }, [navigate]);

    const updateToken = useCallback((newToken: string | null) => {
        if (newToken) {
            localStorage.setItem('accessToken', newToken);
            setupInterceptors(newToken);
            setToken(newToken);
        } else {
            localStorage.removeItem('accessToken');
            setupInterceptors(null);
            setToken(null);
            setUser(null);
        }
    }, []);

    const refreshUserToken = useCallback(async (): Promise<boolean> => {
        try {
            const response = await refreshToken();
            if (response.data && response.data.token) {
                updateToken(response.data.token);
                return true;
            }
            logout();
            return false;
        } catch (error) {
            console.error('Token refresh error:', error);
            logout();
            return false;
        }
    }, [updateToken, logout]);

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('accessToken');

            if (storedToken) {
                if (tokenExpired(storedToken)) {
                    logout();
                } else {
                    setToken(storedToken);
                    setupInterceptors(storedToken);
                    try {
                        const response = await getUserProfile();
                        setUser(response.data);
                    } catch (error) {
                        logout();
                    }
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, [logout]);

    const value = {
        user,
        token,
        setUser,
        loading,
        logout,
        authenticated: !!user && !!token,
        refreshUserToken
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContext;