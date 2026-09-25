import React from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Project, Issue } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { useMoveIssue } from '../../hooks/useMoveIssue';

export interface KanbanBoardProps {
  project: Project;
  onQuickAddIssue: (columnId: string) => void;
  onCardClick?: (issue: Issue) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  project,
  onQuickAddIssue,
  onCardClick,
}) => {
  const moveIssueMutation = useMoveIssue();
  const columns = project.columns || [];

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // Position unchanged
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;

    const sourceCol = columns.find((c) => c.id === sourceColId);
    const destCol = columns.find((c) => c.id === destColId);

    if (!sourceCol || !destCol) return;

    // Get current issues in target column
    const sourceIssues = [...(sourceCol.issues || [])];
    const destIssues = sourceColId === destColId ? sourceIssues : [...(destCol.issues || [])];

    // Remove from source and place in destination
    const [movedIssue] = sourceIssues.splice(source.index, 1);
    if (!movedIssue) return;

    destIssues.splice(destination.index, 0, movedIssue);

    // Calculate new position
    let newPosition = 100;
    const prevIssue = destIssues[destination.index - 1];
    const nextIssue = destIssues[destination.index + 1];

    if (!prevIssue && !nextIssue) {
      // Sole item in column
      newPosition = 100;
    } else if (!prevIssue && nextIssue) {
      // Placed at the very top
      newPosition = nextIssue.position > 1 ? nextIssue.position / 2 : nextIssue.position - 100;
    } else if (prevIssue && !nextIssue) {
      // Placed at the very bottom
      newPosition = prevIssue.position + 100;
    } else if (prevIssue && nextIssue) {
      // Inserted between two items
      newPosition = (prevIssue.position + nextIssue.position) / 2;
    }

    // Trigger optimistic mutation
    moveIssueMutation.mutate({
      projectId: project.id,
      issueId: draggableId,
      targetColumnId: destColId,
      newPosition,
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex-1 flex gap-5 overflow-x-auto pb-4 pt-1 items-start min-h-0 select-none">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            issues={column.issues || []}
            onQuickAdd={onQuickAddIssue}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </DragDropContext>
  );
};
