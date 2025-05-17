import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { tokenExpired } from '../utils/tokenUtils';

const GuestRoute = () => {
    const { authenticated, token } = useAuth();
    const isLoggedInWithValidToken = authenticated && token && !tokenExpired(token);
    return isLoggedInWithValidToken ? <Navigate to="/Uzytkownik" replace /> : <Outlet />;
};
export default GuestRoute;