import { User } from '../context/AuthContext';
import apiInterceptor from './apiInterceptor';

export const getUserProfile = () => {
    return apiInterceptor.get<User>('/users/me');
};



