import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, ArrowLeft, Hash } from 'lucide-react';
import { useProjectBoard } from '../hooks/useProjectBoard';
import { Button, LoadingSkeleton } from '../components/common';

export const ProjectBoardPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading } = useProjectBoard(projectId);

  return (
    <div className="flex flex-col h-full gap-5 max-w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to="/projects"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to Projects"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-2xl font-bold text-white tracking-tight">
                {project?.name || 'Project Board'}
              </h1>
              {project?.key && (
                <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-xs font-bold font-mono">
                  {project.key}
                </span>
              )}
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              {project?.description || 'Interactive Kanban issue movement board.'}
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={16} />}
          onClick={() => {}}
        >
          Create Issue
        </Button>
      </div>

      {/* Columns Container */}
      {isLoading ? (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <LoadingSkeleton key={i} type="column" />
          ))}
        </div>
      ) : project?.columns && project.columns.length > 0 ? (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-start min-h-0">
          {project.columns.map((col) => (
            <div
              key={col.id}
              className="w-72 shrink-0 bg-bg-surface rounded-xl border border-border-subtle p-3.5 flex flex-col gap-3 max-h-full"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle/70">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {col.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px] font-semibold">
                  {col.issues?.length || 0}
                </span>
              </div>

              {/* Column Issue Cards preview */}
              <div className="flex flex-col gap-2.5 overflow-y-auto pr-1">
                {col.issues && col.issues.length > 0 ? (
                  col.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="p-3.5 rounded-lg bg-slate-900/90 border border-border-subtle/80 hover:border-indigo-500/50 transition-all flex flex-col gap-2 shadow-sm cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold font-mono text-indigo-400">
                          {issue.issue_key}
                        </span>
                        <span className="text-[10px] font-semibold uppercase text-slate-400">
                          {issue.priority}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-100 line-clamp-2 leading-snug">
                        {issue.title}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-8 px-3 border border-dashed border-border-subtle rounded-lg text-center text-xs text-slate-500">
                    No issues in this column
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
          No board columns configured for this project.
        </div>
      )}
    </div>
  );
};
