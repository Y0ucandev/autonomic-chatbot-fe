import { createContext, useState, useEffect, ReactNode } from 'react';
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}
interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    logout: () => void;
    isAuthenticated: boolean;
}
const defaultAuthContext: AuthContextType = {
    user: null,
    setUser: () => { },
    loading: true,
    logout: () => { },
    isAuthenticated: false
};
const AuthContext = createContext<AuthContextType>(defaultAuthContext);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const checkLoggedIn = async (): Promise<void> => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const response = await fetch('https://url:/users/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                    } else {
                        localStorage.removeItem('accessToken');
                    }
                } catch (error) {
                    localStorage.removeItem('accessToken');
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);
    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        window.location.href = '/login';
    };
    const value = {
        user,
        setUser,
        loading,
        logout,
        isAuthenticated: !!user
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContext;