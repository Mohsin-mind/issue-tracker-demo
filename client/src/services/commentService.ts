import { apiClient } from './api';
import { Comment, ApiResponse } from '../types';

export const commentService = {
  getByIssueId: async (issueId: string): Promise<Comment[]> => {
    const res = (await apiClient.get(`/issues/${issueId}/comments`)) as unknown as ApiResponse<Comment[]>;
    return res.data;
  },

  create: async (issueId: string, userId: string, body: string): Promise<Comment> => {
    const res = (await apiClient.post(`/issues/${issueId}/comments`, {
      userId,
      body,
    })) as unknown as ApiResponse<Comment>;
    return res.data;
  },

  delete: async (commentId: string): Promise<void> => {
    await apiClient.delete(`/comments/${commentId}`);
  },
};
