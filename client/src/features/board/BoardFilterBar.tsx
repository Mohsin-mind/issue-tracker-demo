import React, { useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Project } from '../../types';
import { useUsers } from '../../hooks/useUsers';
import { useEpics } from '../../hooks/useEpics';

export interface BoardFilters {
  search: string;
  type: string;
  priority: string;
  assigneeId: string;
  epicId: string;
}

export interface BoardFilterBarProps {
  project: Project;
  filters: BoardFilters;
  onFilterChange: (filters: BoardFilters) => void;
  onReset: () => void;
}

export const BoardFilterBar: React.FC<BoardFilterBarProps> = ({
  project,
  filters,
  onFilterChange,
  onReset,
}) => {
  const { data: users } = useUsers();
  const { data: epics } = useEpics(project.id);

  const availableMembers = useMemo(() => {
    return project.members && project.members.length > 0 ? project.members : users || [];
  }, [project.members, users]);

  const isFiltered = Boolean(
    filters.search || filters.type || filters.priority || filters.assigneeId || filters.epicId
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-border-subtle rounded-2xl shadow-xs">
      <div className="flex flex-wrap items-center gap-[14px] flex-1 min-w-[280px]">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Filter by title or key..."
            className="w-full h-[42px] bg-slate-50 text-slate-800 placeholder:text-slate-400 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-xl pl-[46px] pr-4 text-xs font-medium outline-none transition-all"
          />
        </div>

        {/* Issue Type Filter */}
        <div className="flex items-center gap-1.5">
          <select
            value={filters.type}
            onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
            className="h-[42px] bg-slate-50 text-slate-700 text-xs font-medium rounded-xl px-[14px] pr-8 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none cursor-pointer shadow-2xs"
          >
            <option value="">All Types</option>
            <option value="STORY">📗 Story</option>
            <option value="BUG">🔴 Bug</option>
            <option value="TASK">📘 Task</option>
          </select>
        </div>

        {/* Epic Filter */}
        <div className="flex items-center gap-1.5">
          <select
            value={filters.epicId}
            onChange={(e) => onFilterChange({ ...filters, epicId: e.target.value })}
            className="h-[42px] bg-slate-50 text-slate-700 text-xs font-medium rounded-xl px-[14px] pr-8 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none cursor-pointer shadow-2xs max-w-[170px] truncate"
          >
            <option value="">All Epics</option>
            <option value="no_epic">No Epic</option>
            {epics && epics.map((epic) => (
              <option key={epic.id} value={epic.id}>
                ⚡ {epic.name}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
            className="h-[42px] bg-slate-50 text-slate-700 text-xs font-medium rounded-xl px-[14px] pr-8 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none cursor-pointer shadow-2xs"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        {/* Assignee Filter */}
        <div className="flex items-center gap-1.5">
          <select
            value={filters.assigneeId}
            onChange={(e) => onFilterChange({ ...filters, assigneeId: e.target.value })}
            className="h-[42px] bg-slate-50 text-slate-700 text-xs font-medium rounded-xl px-[14px] pr-8 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none cursor-pointer shadow-2xs"
          >
            <option value="">All Assignees</option>
            <option value="unassigned">Unassigned</option>
            {availableMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {isFiltered && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-bold px-[14px] py-2 rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer shrink-0"
        >
          <X size={14} />
          Reset filters
        </button>
      )}
    </div>
  );
};

