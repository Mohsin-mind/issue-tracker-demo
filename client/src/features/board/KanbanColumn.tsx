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
    if (lower.includes('to do') || lower.includes('todo')) return 'bg-blue-500';
    if (lower.includes('progress')) return 'bg-amber-500';
    if (lower.includes('review') || lower.includes('triage')) return 'bg-purple-500';
    if (lower.includes('done') || lower.includes('completed')) return 'bg-emerald-500';
    return 'bg-indigo-500';
  };

  return (
    <div className="w-80 shrink-0 bg-slate-100/90 border border-slate-200/90 rounded-2xl flex flex-col max-h-full shadow-2xs">
      {/* Column Header */}
      <div className="px-[18px] py-[14px] flex items-center justify-between border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${getColumnDotColor(column.name)}`} />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {column.name}
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-600 shadow-2xs">
            {issues.length}
          </span>
        </div>

        <button
          onClick={() => onQuickAdd(column.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200/70 transition-colors cursor-pointer"
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
            className={`flex-1 p-[14px] flex flex-col gap-[14px] overflow-y-auto min-h-48 transition-colors rounded-b-2xl ${
              snapshot.isDraggingOver
                ? 'bg-indigo-50/70 border-2 border-dashed border-indigo-400/60'
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
              <div className="h-36 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-xs font-medium p-4">
                No issues in column
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};
