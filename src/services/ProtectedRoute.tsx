import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
    const { authenticated } = useAuth();

    return authenticated ? <Outlet /> : <Navigate to="/Logowanie" replace />;
};
export default ProtectedRoute;