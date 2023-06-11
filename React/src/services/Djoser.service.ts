import { apiClient } from '@/services/apiClient.ts';

const activateUser = (data: any) => apiClient.post('/djoser/users/activation/', data);

export const DjoserService = {
    activateUser,
}
