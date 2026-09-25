import { useQuery } from '@tanstack/react-query';
import { projectService } from '../services/projectService';
import { projectKeys } from './useProjects';

export const useProjectStatistics = (projectId?: string) => {
  return useQuery({
    queryKey: projectKeys.statistics(projectId || ''),
    queryFn: () => projectService.getStatistics(projectId!),
    enabled: Boolean(projectId),
  });
};
