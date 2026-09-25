import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { issueService, UpdateIssuePayload } from '../services/issueService';
import { projectKeys } from './useProjects';
import { Issue } from '../types';

export const issueKeys = {
  all: ['issues'] as const,
  detail: (id: string) => [...issueKeys.all, 'detail', id] as const,
};

export const useIssue = (issueId?: string) => {
  return useQuery<Issue>({
    queryKey: issueKeys.detail(issueId || ''),
    queryFn: () => issueService.getById(issueId!),
    enabled: Boolean(issueId),
  });
};

export interface UpdateIssueMutationVariables {
  issueId: string;
  projectId: string;
  payload: UpdateIssuePayload;
}

export const useUpdateIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ issueId, payload }: UpdateIssueMutationVariables) =>
      issueService.update(issueId, payload),
    onSuccess: (updatedIssue, variables) => {
      // Update local issue query cache
      queryClient.setQueryData(issueKeys.detail(variables.issueId), updatedIssue);

      // Invalidate project board to refresh card previews
      queryClient.invalidateQueries({ queryKey: projectKeys.board(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.statistics(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: ['recent-issues'] });
    },
  });
};

export interface DeleteIssueMutationVariables {
  issueId: string;
  projectId: string;
}

export const useDeleteIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ issueId }: DeleteIssueMutationVariables) =>
      issueService.delete(issueId),
    onSuccess: (_, variables) => {
      queryClient.removeQueries({ queryKey: issueKeys.detail(variables.issueId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.board(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.statistics(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['recent-issues'] });
    },
  });
};
