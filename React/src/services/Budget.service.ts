import { apiClient } from '@/services/apiClient.ts';

const getBudgets = () => apiClient.get('/budget/budgets/').then(response => response?.data?.results ?? []);

const updateBudget = (id: any, data: any) => apiClient.put(`/budget/budgets/${id}/`, data);

const copyBudget = (id: any) => apiClient.post(`/budget/budgets/${id}/copy/`, {});

const deleteBudget = (id: any) => apiClient.delete(`/budget/budgets/${id}/`);

const postCreateCategory = (data: any) => apiClient.post('/budget/categories/', data);

const putUpdateCategory = (id: any, data: any) => apiClient.put(`/budget/categories/${id}/`, data);

const deleteCategory = (id: any) => apiClient.delete(`/budget/categories/${id}/`);

const postCreateItem = (data: any) => apiClient.post('/budget/category_items/', data);

const putUpdateItem = (id: any, data: any) => apiClient.put(`/budget/category_items/${id}/`, data);

const postItemDown = (id: any) => apiClient.post(`/budget/category_items/${id}/move_down/`);

const postItemUp = (id: any) => apiClient.post(`/budget/category_items/${id}/move_up/`);

const deleteItem = (id: any) => apiClient.delete(`/budget/category_items/${id}/`);

const createItem = (data: any) => apiClient.post(`/budget/category_items/`, data);

const updateItem = (id: any, data: any) => apiClient.put(`/budget/category_items/${id}/`, data);

export const BudgetService = {
    getBudgets,
    updateBudget,
    copyBudget,
    deleteBudget,
    postCreateCategory,
    putUpdateCategory,
    deleteCategory,
    postCreateItem,
    putUpdateItem,
    postItemDown,
    postItemUp,
    deleteItem,
    createItem,
    updateItem,
}
