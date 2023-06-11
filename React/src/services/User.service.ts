import { apiClient } from "./apiClient";

const getUserProfile = () => apiClient.get('/user/profile/');

export const UserService = {
    getUserProfile,
}
