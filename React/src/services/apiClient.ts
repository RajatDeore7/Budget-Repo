import axios from 'axios';
import {LOCAL_STORAGE_KEY} from '@/constants/common';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    }
});

apiClient.interceptors.request.use(
    (_config: any) => {
        const token = localStorage.getItem(LOCAL_STORAGE_KEY.TOKEN) || undefined;
        const config = {..._config, headers: {..._config.headers}};
        if (token) {
            config.headers.Authorization = `JWT ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
