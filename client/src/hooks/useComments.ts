import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '../services/commentService';
import { projectKeys } from './useProjects';
import { issueKeys } from './useIssue';
import { Comment } from '../types';

export const commentKeys = {
  all: ['comments'] as const,
  byIssue: (issueId: string) => [...commentKeys.all, 'issue', issueId] as const,
};

export const useComments = (issueId?: string) => {
  return useQuery<Comment[]>({
    queryKey: commentKeys.byIssue(issueId || ''),
    queryFn: () => commentService.getByIssueId(issueId!),
    enabled: Boolean(issueId),
  });
};

export interface AddCommentVariables {
  issueId: string;
  projectId: string;
  userId: string;
  body: string;
}

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ issueId, userId, body }: AddCommentVariables) =>
      commentService.create(issueId, userId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byIssue(variables.issueId) });
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(variables.issueId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.board(variables.projectId) });
    },
  });
};

export interface DeleteCommentVariables {
  commentId: string;
  issueId: string;
  projectId: string;
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: DeleteCommentVariables) =>
      commentService.delete(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byIssue(variables.issueId) });
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(variables.issueId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.board(variables.projectId) });
    },
  });
};
