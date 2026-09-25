import { useMutation, useQueryClient } from '@tanstack/react-query';
import { issueService } from '../services/issueService';
import { projectKeys } from './useProjects';
import { Project, Issue } from '../types';

export interface MoveIssueVariables {
  projectId: string;
  issueId: string;
  targetColumnId: string;
  newPosition: number;
}

export const useMoveIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ issueId, targetColumnId, newPosition }: MoveIssueVariables) =>
      issueService.move(issueId, targetColumnId, newPosition),

    onMutate: async ({ projectId, issueId, targetColumnId, newPosition }) => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: projectKeys.board(projectId) });

      // Snapshot previous board state
      const previousBoard = queryClient.getQueryData<Project>(projectKeys.board(projectId));

      if (previousBoard && previousBoard.columns) {
        let movedIssue: Issue | null = null;

        // 1. Remove the issue from source column
        const updatedColumns = previousBoard.columns.map((col) => {
          const issueIndex = col.issues?.findIndex((iss) => iss.id === issueId) ?? -1;
          if (issueIndex !== -1 && col.issues) {
            movedIssue = {
              ...col.issues[issueIndex],
              column_id: targetColumnId,
              position: newPosition,
            };
            return {
              ...col,
              issues: col.issues.filter((iss) => iss.id !== issueId),
            };
          }
          return col;
        });

        // 2. Insert into target column and sort by position
        if (movedIssue) {
          const finalColumns = updatedColumns.map((col) => {
            if (col.id === targetColumnId) {
              const issues = [...(col.issues || []), movedIssue!].sort(
                (a, b) => a.position - b.position
              );
              return { ...col, issues };
            }
            return col;
          });

          // 3. Optimistically set the cache
          queryClient.setQueryData<Project>(projectKeys.board(projectId), {
            ...previousBoard,
            columns: finalColumns,
          });
        }
      }

      return { previousBoard, projectId };
    },

    onError: (_err, _variables, context) => {
      // Revert cache to previous snapshot on error
      if (context?.previousBoard && context?.projectId) {
        queryClient.setQueryData(
          projectKeys.board(context.projectId),
          context.previousBoard
        );
      }
    },

    onSettled: (_data, _error, variables) => {
      // Refetch board and statistics to guarantee database sync
      queryClient.invalidateQueries({ queryKey: projectKeys.board(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.statistics(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: ['recent-issues'] });
    },
  });
};
