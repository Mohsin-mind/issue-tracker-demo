import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { epicService, CreateEpicPayload, UpdateEpicPayload } from '../services/epicService';
import { projectKeys } from './useProjects';

export const epicKeys = {
  all: ['epics'] as const,
  projectList: (projectId: string) => [...epicKeys.all, 'project', projectId] as const,
  detail: (epicId: string) => [...epicKeys.all, 'detail', epicId] as const,
};

export const useEpics = (projectId?: string) => {
  return useQuery({
    queryKey: epicKeys.projectList(projectId || ''),
    queryFn: () => epicService.getByProject(projectId!),
    enabled: Boolean(projectId),
  });
};

export const useEpic = (epicId?: string) => {
  return useQuery({
    queryKey: epicKeys.detail(epicId || ''),
    queryFn: () => epicService.getById(epicId!),
    enabled: Boolean(epicId),
  });
};

export const useCreateEpic = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEpicPayload) => epicService.create(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: epicKeys.projectList(projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.board(projectId) });
    },
  });
};

export const useUpdateEpic = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ epicId, payload }: { epicId: string; payload: UpdateEpicPayload }) =>
      epicService.update(epicId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: epicKeys.projectList(projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.board(projectId) });
    },
  });
};

export const useDeleteEpic = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (epicId: string) => epicService.delete(epicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: epicKeys.projectList(projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.board(projectId) });
    },
  });
};
