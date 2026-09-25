import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FolderKanban, Users } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import {
  Button,
  LoadingSkeleton,
  EmptyState,
} from '../components/common';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';

export const ProjectsPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: projects, isLoading } = useProjects();

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
            Projects
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            All team workspaces, agile boards, and project directories.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={18} />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Project
        </Button>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton type="card" count={3} height="200px" />
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border border-border-subtle hover:border-slate-300 transition-all p-6 flex flex-col justify-between min-h-[220px] gap-4 shadow-xs hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold font-mono">
                  {proj.key}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {proj.issues_count || 0} issues
                </span>
              </div>

              <div className="flex flex-col gap-1.5 my-1">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{proj.name}</h3>
                <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                  {proj.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-auto pt-[18px] border-t border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Users size={15} />
                  <span>{proj.members_count || 0} members</span>
                </div>

                <Link to={`/projects/${proj.id}`}>
                  <Button variant="primary" size="sm" icon={<FolderKanban size={14} />}>
                    Open Board
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects found"
          description="Get started by creating your first agile project."
          actionText="Create Project"
          onAction={() => setIsCreateModalOpen(true)}
        />
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
