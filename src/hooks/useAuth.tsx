import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth musi być używany wewnątrz AuthProvider');
    }
    return context;
};
export default useAuth;