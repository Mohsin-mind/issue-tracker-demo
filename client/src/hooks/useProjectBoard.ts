import { useQuery } from '@tanstack/react-query';
import { projectService } from '../services/projectService';
import { projectKeys } from './useProjects';

export const useProjectBoard = (projectId?: string) => {
  return useQuery({
    queryKey: projectKeys.board(projectId || ''),
    queryFn: () => projectService.getBoard(projectId!),
    enabled: Boolean(projectId),
  });
};
