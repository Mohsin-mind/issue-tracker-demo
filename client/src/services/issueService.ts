import { apiClient } from './api';
import { Issue, ApiResponse, Priority } from '../types';

export interface CreateIssuePayload {
  projectId: string;
  columnId: string;
  title: string;
  description?: string;
  priority?: Priority;
  assigneeId?: string | null;
  reporterId: string;
  labelIds?: string[];
  dueDate?: string | null;
}

export interface UpdateIssuePayload {
  title?: string;
  description?: string | null;
  priority?: Priority;
  columnId?: string;
  assigneeId?: string | null;
  labelIds?: string[];
  dueDate?: string | null;
  position?: number;
}

export interface IssueFilterParams {
  projectId?: string;
  columnId?: string;
  search?: string;
  priority?: string;
  assigneeId?: string;
  labelId?: string;
}

export const issueService = {
  getAll: async (params?: IssueFilterParams): Promise<Issue[]> => {
    const res = (await apiClient.get('/issues', { params })) as unknown as ApiResponse<Issue[]>;
    return res.data;
  },

  getById: async (issueId: string): Promise<Issue> => {
    const res = (await apiClient.get(`/issues/${issueId}`)) as unknown as ApiResponse<Issue>;
    return res.data;
  },

  create: async (payload: CreateIssuePayload): Promise<Issue> => {
    const res = (await apiClient.post('/issues', payload)) as unknown as ApiResponse<Issue>;
    return res.data;
  },

  update: async (issueId: string, payload: UpdateIssuePayload): Promise<Issue> => {
    const res = (await apiClient.put(`/issues/${issueId}`, payload)) as unknown as ApiResponse<Issue>;
    return res.data;
  },

  delete: async (issueId: string): Promise<void> => {
    await apiClient.delete(`/issues/${issueId}`);
  },

  move: async (issueId: string, targetColumnId: string, newPosition: number): Promise<{ id: string; columnId: string; position: number }> => {
    const res = (await apiClient.patch(`/issues/${issueId}/move`, {
      targetColumnId,
      newPosition,
    })) as unknown as ApiResponse<{ id: string; columnId: string; position: number }>;
    return res.data;
  },
};
