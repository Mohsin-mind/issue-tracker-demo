import { useMutation, useQueryClient } from '@tanstack/react-query';
import { issueService, CreateIssuePayload } from '../services/issueService';
import { projectKeys } from './useProjects';

export const useCreateIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateIssuePayload) => issueService.create(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.board(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.statistics(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['recent-issues'] });
    },
  });
};
