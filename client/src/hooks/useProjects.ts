import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService, CreateProjectPayload } from '../services/projectService';

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
  board: (id: string) => [...projectKeys.all, 'board', id] as const,
  statistics: (id: string) => [...projectKeys.all, 'statistics', id] as const,
};

export const useProjects = () => {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: projectService.getAll,
  });
};

export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => projectService.getById(projectId),
    enabled: Boolean(projectId),
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => projectService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) => projectService.delete(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};
