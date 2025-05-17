import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { tokenExpired } from '../utils/tokenUtils';

const ProtectedRoute = () => {
    const { token, authenticated, refreshUserToken } = useAuth();

    useEffect(() => {
        const verifyToken = async () => {
            if (token && tokenExpired(token)) {
                try {
                    await refreshUserToken();
                } catch (error) {
                    console.error('Token refresh error:', error);
                }
            }
        };
        verifyToken();
    }, [token, refreshUserToken]);

    return authenticated ? <Outlet /> : <Navigate to="/Logowanie" replace />;
};
export default ProtectedRoute;