import { apiClient } from "./apiClient";

const login = (data: any) => apiClient.post('/auth/login/', data);
const register = (data: any) => apiClient.post('/user/register/', data);
const resetPassword = (data: any) => apiClient.post('/djoser/users/reset_password/', data)
const newPassword = (data: any) => apiClient.post('/djoser/users/reset_password_confirm/', data)

/**
 *
 */
export const AuthService = {
    login,
    register,
    resetPassword,
    newPassword
}
