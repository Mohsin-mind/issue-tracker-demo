import { apiClient } from './api';
import { Epic, ApiResponse, EpicStatus } from '../types';

export interface CreateEpicPayload {
  name: string;
  description?: string;
  color?: string;
  status?: EpicStatus;
}

export interface UpdateEpicPayload {
  name?: string;
  description?: string | null;
  color?: string;
  status?: EpicStatus;
}

export const epicService = {
  getByProject: async (projectId: string): Promise<Epic[]> => {
    const res = (await apiClient.get(`/projects/${projectId}/epics`)) as unknown as ApiResponse<Epic[]>;
    return res.data;
  },

  getById: async (epicId: string): Promise<Epic> => {
    const res = (await apiClient.get(`/epics/${epicId}`)) as unknown as ApiResponse<Epic>;
    return res.data;
  },

  create: async (projectId: string, payload: CreateEpicPayload): Promise<Epic> => {
    const res = (await apiClient.post(`/projects/${projectId}/epics`, payload)) as unknown as ApiResponse<Epic>;
    return res.data;
  },

  update: async (epicId: string, payload: UpdateEpicPayload): Promise<Epic> => {
    const res = (await apiClient.put(`/epics/${epicId}`, payload)) as unknown as ApiResponse<Epic>;
    return res.data;
  },

  delete: async (epicId: string): Promise<void> => {
    await apiClient.delete(`/epics/${epicId}`);
  },
};
