import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Project, Priority } from '../../types';

export interface BoardFilters {
  search: string;
  priority: string;
  assigneeId: string;
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
  const isFiltered = Boolean(
    filters.search || filters.priority || filters.assigneeId
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950/60 border border-border-subtle/70 rounded-xl">
      <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Filter by title or key..."
            className="w-full bg-slate-900 text-slate-100 placeholder:text-slate-500 border border-border-subtle focus:border-indigo-500 rounded-lg py-1.5 pl-9 pr-3 text-xs outline-none transition-colors"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
            className="bg-slate-900 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 border border-border-subtle focus:border-indigo-500 outline-none cursor-pointer"
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
            className="bg-slate-900 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 border border-border-subtle focus:border-indigo-500 outline-none cursor-pointer"
          >
            <option value="">All Assignees</option>
            <option value="unassigned">Unassigned</option>
            {(project.members || []).map((m) => (
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
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={14} />
          Reset filters
        </button>
      )}
    </div>
  );
};
