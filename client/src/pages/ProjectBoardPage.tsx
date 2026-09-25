import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import { useProjectBoard } from '../hooks/useProjectBoard';
import { Button, LoadingSkeleton, Avatar } from '../components/common';
import { KanbanBoard } from '../features/board/KanbanBoard';
import { CreateIssueModal } from '../features/issues/CreateIssueModal';
import { Issue } from '../types';

export const ProjectBoardPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading, error } = useProjectBoard(projectId);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | undefined>();

  const handleQuickAdd = (columnId: string) => {
    setSelectedColumnId(columnId);
    setIsCreateModalOpen(true);
  };

  const handleOpenGeneralCreate = () => {
    setSelectedColumnId(undefined);
    setIsCreateModalOpen(true);
  };

  const handleCardClick = (issue: Issue) => {
    console.log('Selected issue for detail view:', issue.issue_key);
    // Detail drawer integration in Phase 6
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <h2 className="text-xl font-bold text-red-400">Failed to load project board</h2>
        <p className="text-slate-400 text-sm max-w-md">{(error as Error).message}</p>
        <Link to="/projects">
          <Button variant="secondary" icon={<ArrowLeft size={16} />}>
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-5 max-w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to="/projects"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
            <p className="text-slate-400 text-xs mt-0.5 line-clamp-1 max-w-2xl">
              {project?.description || 'Interactive Kanban issue movement board.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Project Members Stack */}
          {project?.members && project.members.length > 0 && (
            <div className="flex items-center -space-x-2 overflow-hidden py-1 px-2">
              {project.members.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="ring-2 ring-slate-950 rounded-full"
                  title={member.name}
                >
                  <Avatar name={member.name} color={member.avatar_color} size="sm" />
                </div>
              ))}
              {project.members.length > 5 && (
                <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-950">
                  +{project.members.length - 5}
                </span>
              )}
            </div>
          )}

          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={16} />}
            onClick={handleOpenGeneralCreate}
          >
            Create Issue
          </Button>
        </div>
      </div>

      {/* Board Container */}
      {isLoading ? (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <LoadingSkeleton key={i} type="column" />
          ))}
        </div>
      ) : project ? (
        <KanbanBoard
          project={project}
          onQuickAddIssue={handleQuickAdd}
          onCardClick={handleCardClick}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
          No project data found.
        </div>
      )}

      {/* Create Issue Modal */}
      {project && (
        <CreateIssueModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          project={project}
          defaultColumnId={selectedColumnId}
        />
      )}
    </div>
  );
};
