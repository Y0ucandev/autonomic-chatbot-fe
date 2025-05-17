import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenExpired } from '../utils/tokenUtils';
import { setupInterceptors } from '../services/apiInterceptor';
import { logout as logoutFromServer, refreshToken } from '../services/authService';

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
    token: string | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    logout: () => void;
    authenticated: boolean;
    refreshUserToken: () => Promise<boolean>;
    updateToken: (newToken: string | null) => void;
}

const defaultAuthContext: AuthContextType = {
    user: null,
    token: null,
    setUser: () => { },
    loading: true,
    logout: () => { },
    authenticated: false,
    refreshUserToken: () => Promise.resolve(false),
    updateToken: () => { },

};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [token, setToken] = useState<string | null>(null);

    const logout = useCallback(async () => {
        try {
            await logoutFromServer();
        } catch (error) {
            console.error('Server logout error:', error);
        }
        finally {
            localStorage.removeItem('accessToken');
            setupInterceptors(null);
            setToken(null);
            setUser(null);
            navigate('/Logowanie');
        }
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
            if (!token) return false;
            const refreshResponse = await refreshToken(token);
            if (refreshResponse && refreshResponse.access_token) {
                updateToken(refreshResponse.access_token);
                return true;
            }
            logout();
            return false;
        } catch (error) {
            console.error('Token refresh error:', error);
            logout();
            return false;
        }
    }, [token, updateToken, logout]);

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('accessToken');

            if (storedToken) {
                if (tokenExpired(storedToken)) {
                    try {
                        const response = await refreshToken(storedToken);
                        updateToken(response.access_token);
                    } catch (error) {
                        console.error('Unable to refresh token:', error);
                        logout();
                    }
                } else {
                    setToken(storedToken);
                    setupInterceptors(storedToken);
                    // try {
                    //     const response = await getUserProfile();
                    //     setUser(response.data);
                    // } catch (error) {
                    //     logout();
                    // }
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
        authenticated: !!token,
        // authenticated: !!user && !!token,
        refreshUserToken,
        updateToken
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContext;