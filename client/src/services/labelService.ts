import { apiClient } from './api';
import { Label, ApiResponse } from '../types';

export const labelService = {
  getByProject: async (projectId: string): Promise<Label[]> => {
    const res = (await apiClient.get('/labels', {
      params: { projectId },
    })) as unknown as ApiResponse<Label[]>;
    return res.data;
  },

  create: async (projectId: string, name: string, color: string): Promise<Label> => {
    const res = (await apiClient.post('/labels', {
      projectId,
      name,
      color,
    })) as unknown as ApiResponse<Label>;
    return res.data;
  },
};
