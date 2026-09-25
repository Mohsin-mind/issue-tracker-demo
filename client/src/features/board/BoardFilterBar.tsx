import React from 'react';
import { Search, X } from 'lucide-react';
import { Project } from '../../types';

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
    <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-white border border-border-subtle rounded-2xl shadow-xs">
      <div className="flex flex-wrap items-center gap-3.5 flex-1 min-w-[280px]">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Filter issues by title or key..."
            className="w-full h-10 bg-slate-50 text-slate-800 placeholder:text-slate-400 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-xl pl-10 pr-4 text-xs font-medium outline-none transition-all"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
            className="h-10 bg-slate-50 text-slate-700 text-xs font-medium rounded-xl px-3.5 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none cursor-pointer shadow-2xs"
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
            className="h-10 bg-slate-50 text-slate-700 text-xs font-medium rounded-xl px-3.5 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none cursor-pointer shadow-2xs"
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
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
        >
          <X size={14} />
          Reset filters
        </button>
      )}
    </div>
  );
};
