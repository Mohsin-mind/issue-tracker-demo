import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { BoardColumn, Issue } from '../../types';
import { IssueCard } from './IssueCard';

export interface KanbanColumnProps {
  column: BoardColumn;
  issues: Issue[];
  onQuickAdd: (columnId: string) => void;
  onCardClick?: (issue: Issue) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  issues,
  onQuickAdd,
  onCardClick,
}) => {
  // Column color accents based on status name
  const getColumnDotColor = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('backlog')) return 'bg-slate-400';
    if (lower.includes('to do') || lower.includes('todo')) return 'bg-blue-400';
    if (lower.includes('progress')) return 'bg-amber-400';
    if (lower.includes('review') || lower.includes('triage')) return 'bg-purple-400';
    if (lower.includes('done') || lower.includes('completed')) return 'bg-emerald-400';
    return 'bg-indigo-400';
  };

  return (
    <div className="w-80 shrink-0 bg-slate-950/70 border border-border-subtle rounded-2xl flex flex-col max-h-full">
      {/* Column Header */}
      <div className="p-3.5 pb-2 flex items-center justify-between border-b border-border-subtle/50">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${getColumnDotColor(column.name)}`} />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {column.name}
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-400">
            {issues.length}
          </span>
        </div>

        <button
          onClick={() => onQuickAdd(column.id)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={`Add issue to ${column.name}`}
          aria-label={`Add issue to ${column.name}`}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Droppable Issue List */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2.5 flex flex-col gap-2.5 overflow-y-auto min-h-40 transition-colors rounded-b-2xl ${snapshot.isDraggingOver
                ? 'bg-indigo-950/20 border-2 border-dashed border-indigo-500/40'
                : 'border-2 border-transparent'
              }`}
          >
            {issues.map((issue, index) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                index={index}
                onClick={onCardClick}
              />
            ))}

            {provided.placeholder}

            {issues.length === 0 && !snapshot.isDraggingOver && (
              <div className="h-28 border border-dashed border-border-subtle/70 rounded-xl flex items-center justify-center text-slate-500 text-xs">
                No issues here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};
