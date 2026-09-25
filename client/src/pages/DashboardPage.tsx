import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  FolderKanban,
  Users,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useQuery } from '@tanstack/react-query';
import { issueService } from '../services/issueService';
import {
  Button,
  Badge,
  Avatar,
  LoadingSkeleton,
  EmptyState,
} from '../components/common';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';
import { formatRelativeTime } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: projects, isLoading: isProjectsLoading } = useProjects();

  // Query recent issues across all projects
  const { data: recentIssues, isLoading: isIssuesLoading } = useQuery({
    queryKey: ['recent-issues'],
    queryFn: () => issueService.getAll(),
  });

  // Calculate aggregated metrics from projects & issues
  const totalIssuesCount = projects?.reduce((acc, p) => acc + (p.issues_count || 0), 0) || 0;
  const activeProjectsCount = projects?.length || 0;

  // Compute breakdown across columns
  let openCount = 0;
  let inProgressCount = 0;
  let doneCount = 0;

  if (recentIssues && Array.isArray(recentIssues)) {
    for (const iss of recentIssues) {
      const colName = iss.column?.name?.toLowerCase() || '';
      if (colName.includes('backlog') || colName.includes('to do') || colName.includes('todo')) {
        openCount++;
      } else if (colName.includes('progress') || colName.includes('review')) {
        inProgressCount++;
      } else if (colName.includes('done') || colName.includes('completed')) {
        doneCount++;
      } else {
        openCount++;
      }
    }
  }

  // Top 6 recently updated issues
  const sortedRecent = recentIssues && Array.isArray(recentIssues)
    ? [...recentIssues]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 6)
    : [];

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">
            Executive Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Cross-project velocity, team capacity, and recent sprint activity.
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 flex flex-col gap-2 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Issues</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers size={19} />
            </div>
          </div>
          <div className="font-display text-3xl font-extrabold text-slate-900 mt-1">
            {isProjectsLoading ? <LoadingSkeleton width="60px" height="32px" /> : totalIssuesCount}
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Across {activeProjectsCount} active projects
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 flex flex-col gap-2 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Open / Backlog</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <AlertCircle size={19} />
            </div>
          </div>
          <div className="font-display text-3xl font-extrabold text-slate-900 mt-1">
            {isIssuesLoading ? <LoadingSkeleton width="60px" height="32px" /> : openCount}
          </div>
          <span className="text-xs text-slate-500 font-medium">Ready for sprint triage</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 flex flex-col gap-2 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">In Progress</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={19} />
            </div>
          </div>
          <div className="font-display text-3xl font-extrabold text-slate-900 mt-1">
            {isIssuesLoading ? <LoadingSkeleton width="60px" height="32px" /> : inProgressCount}
          </div>
          <span className="text-xs text-slate-500 font-medium">Actively under development</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 flex flex-col gap-2 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Done</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={19} />
            </div>
          </div>
          <div className="font-display text-3xl font-extrabold text-slate-900 mt-1">
            {isIssuesLoading ? <LoadingSkeleton width="60px" height="32px" /> : doneCount}
          </div>
          <span className="text-xs text-slate-500 font-medium">Shipped & verified</span>
        </div>
      </div>

      {/* Main Grid: Projects & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Projects Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FolderKanban size={18} className="text-indigo-600" />
              Active Projects
            </h2>
            <Link to="/projects" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
              View all &rarr;
            </Link>
          </div>

          {isProjectsLoading ? (
            <LoadingSkeleton type="card" count={2} height="160px" />
          ) : projects && projects.length > 0 ? (
            <div className="flex flex-col gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-indigo-200 transition-all flex flex-col gap-3.5 shadow-xs hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold font-mono border border-indigo-100">
                        {proj.key}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{proj.name}</h3>
                    </div>
                    <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {proj.issues_count || 0} issues
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                    {proj.description || 'No description provided.'}
                  </p>

                  <div className="flex items-center justify-between pt-4 mt-1 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <Users size={15} className="text-slate-400" />
                      <span>{proj.members_count || 0} team members</span>
                    </div>

                    <Link to={`/projects/${proj.id}`}>
                      <Button variant="primary" size="sm" icon={<ArrowRight size={14} />}>
                        Open Board
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No projects created yet"
              description="Create your first team project to start managing tasks with Kanban boards."
              actionText="Create Project"
              onAction={() => setIsCreateModalOpen(true)}
            />
          )}
        </div>

        {/* Recently Updated Stream (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity size={18} className="text-violet-600" />
              Recent Issue Activity
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col gap-3 shadow-xs">
            {isIssuesLoading ? (
              <LoadingSkeleton type="card" count={4} height="76px" />
            ) : sortedRecent.length > 0 ? (
              sortedRecent.map((iss) => (
                <Link
                  key={iss.id}
                  to={`/projects/${iss.project_id}`}
                  className="p-3.5 rounded-xl bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200/80 hover:border-slate-300 transition-all flex items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                        {iss.issue_key}
                      </span>
                      <Badge priority={iss.priority}>{iss.priority}</Badge>
                    </div>
                    <span className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                      {iss.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    {iss.assignee && (
                      <Avatar
                        name={iss.assignee.name}
                        color={iss.assignee.avatar_color}
                        size="sm"
                      />
                    )}
                    <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                      {formatRelativeTime(iss.updated_at)}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <EmptyState
                title="No recent issues"
                description="Once issues are created and moved on Kanban boards, their activity will stream here."
              />
            )}
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
