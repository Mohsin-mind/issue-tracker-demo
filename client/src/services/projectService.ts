import { apiClient } from './api';
import { Project, ApiResponse } from '../types';

export interface CreateProjectPayload {
  name: string;
  key: string;
  description?: string;
  memberIds?: string[];
}

export interface ProjectStatistics {
  projectId: string;
  projectKey: string;
  projectName: string;
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  completedIssues: number;
}

export const projectService = {
  getAll: async (): Promise<Project[]> => {
    const res = (await apiClient.get('/projects')) as unknown as ApiResponse<Project[]>;
    return res.data;
  },

  getById: async (projectId: string): Promise<Project> => {
    const res = (await apiClient.get(`/projects/${projectId}`)) as unknown as ApiResponse<Project>;
    return res.data;
  },

  create: async (payload: CreateProjectPayload): Promise<Project> => {
    const res = (await apiClient.post('/projects', payload)) as unknown as ApiResponse<Project>;
    return res.data;
  },

  update: async (projectId: string, payload: Partial<CreateProjectPayload>): Promise<Project> => {
    const res = (await apiClient.put(`/projects/${projectId}`, payload)) as unknown as ApiResponse<Project>;
    return res.data;
  },

  delete: async (projectId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}`);
  },

  getBoard: async (projectId: string): Promise<Project> => {
    const res = (await apiClient.get(`/projects/${projectId}/board`)) as unknown as ApiResponse<Project>;
    return res.data;
  },

  getStatistics: async (projectId: string): Promise<ProjectStatistics> => {
    const res = (await apiClient.get(`/projects/${projectId}/statistics`)) as unknown as ApiResponse<ProjectStatistics>;
    return res.data;
  },
};
