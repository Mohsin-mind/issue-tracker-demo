import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { MessageSquare, Calendar, GripVertical } from 'lucide-react';
import { Issue } from '../../types';
import { Badge, Avatar } from '../../components/common';
import { formatDate } from '../../utils/formatters';

export interface IssueCardProps {
  issue: Issue;
  index: number;
  onClick?: (issue: Issue) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, index, onClick }) => {
  const commentsCount = issue.comments_count ?? issue.comments?.length ?? 0;

  return (
    <Draggable draggableId={issue.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          onClick={() => onClick?.(issue)}
          className={`group relative p-[18px] rounded-xl bg-white border transition-all duration-150 select-none cursor-pointer flex flex-col gap-[14px] ${
            snapshot.isDragging
              ? 'border-indigo-500 shadow-xl shadow-indigo-500/15 bg-white rotate-1 scale-[1.02] z-50'
              : 'border-slate-200/90 hover:border-indigo-300 hover:shadow-sm shadow-xs'
          }`}
        >
          {/* Top Row: Key, Priority, Drag Handle */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold font-mono text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
                {issue.issue_key}
              </span>
              <Badge priority={issue.priority} className="text-[10px] py-0 px-2 uppercase font-semibold tracking-wider">
                {issue.priority}
              </Badge>
            </div>

            <div
              {...provided.dragHandleProps}
              className="text-slate-300 group-hover:text-slate-500 p-1 rounded cursor-grab active:cursor-grabbing transition-colors"
              title="Drag to reorder"
            >
              <GripVertical size={14} />
            </div>
          </div>

          {/* Issue Title */}
          <h4 className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 leading-snug line-clamp-2">
            {issue.title}
          </h4>

          {/* Labels if available */}
          {issue.labels && issue.labels.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {issue.labels.map((lbl) => (
                <span
                  key={lbl.id}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${lbl.color}15`,
                    color: lbl.color,
                    border: `1px solid ${lbl.color}35`,
                  }}
                >
                  {lbl.name}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Meta: Due Date, Comments, Assignee */}
          <div className="flex items-center justify-between pt-[14px] mt-1 border-t border-slate-100 text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              {issue.due_date && (
                <div
                  className="flex items-center gap-1.5 text-slate-500"
                  title={`Due: ${formatDate(issue.due_date)}`}
                >
                  <Calendar size={13} className="text-slate-400" />
                  <span className="text-[10px]">{formatDate(issue.due_date)}</span>
                </div>
              )}

              {commentsCount > 0 && (
                <div className="flex items-center gap-1.5 text-slate-500" title={`${commentsCount} comments`}>
                  <MessageSquare size={13} className="text-slate-400" />
                  <span className="text-[10px] font-medium">{commentsCount}</span>
                </div>
              )}
            </div>

            <div className="ml-auto">
              {issue.assignee ? (
                <Avatar
                  name={issue.assignee.name}
                  color={issue.assignee.avatar_color}
                  size="sm"
                />
              ) : (
                <div
                  className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-medium"
                  title="Unassigned"
                >
                  —
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
