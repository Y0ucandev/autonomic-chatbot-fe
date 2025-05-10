import axios from 'axios';
import { api } from '../config/api';

const publicAxios = axios.create({
    baseURL: `${api.apiInterceptor}`
});

export default publicAxios;