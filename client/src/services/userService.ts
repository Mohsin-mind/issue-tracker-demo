import { apiClient } from './api';
import { User, ApiResponse } from '../types';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const res = (await apiClient.get('/users')) as unknown as ApiResponse<User[]>;
    return res.data;
  },

  getById: async (userId: string): Promise<User> => {
    const res = (await apiClient.get(`/users/${userId}`)) as unknown as ApiResponse<User>;
    return res.data;
  },
};
