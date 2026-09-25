import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Calendar,
  User as UserIcon,
  Check,
  Tag,
  Clock,
  Layers,
} from 'lucide-react';
import { Project, Priority } from '../../types';
import { useIssue, useUpdateIssue, useDeleteIssue } from '../../hooks/useIssue';
import {
  Avatar,
  Badge,
  Button,
  ConfirmDialog,
  LoadingSkeleton,
} from '../../components/common';
import { CommentsSection } from './CommentsSection';
import { formatDate } from '../../utils/formatters';

export interface IssueDetailDrawerProps {
  issueId: string | null;
  projectId: string;
  project: Project;
  onClose: () => void;
}

export const IssueDetailDrawer: React.FC<IssueDetailDrawerProps> = ({
  issueId,
  projectId,
  project,
  onClose,
}) => {
  const { data: issue, isLoading } = useIssue(issueId || undefined);
  const updateIssueMutation = useUpdateIssue();
  const deleteIssueMutation = useDeleteIssue();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState('');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (issue) {
      setTitleValue(issue.title);
      setDescValue(issue.description || '');
      setIsEditingTitle(false);
      setIsEditingDesc(false);
    }
  }, [issue]);

  if (!issueId) return null;

  const handleSaveTitle = async () => {
    if (!titleValue.trim() || titleValue === issue?.title) {
      setIsEditingTitle(false);
      return;
    }
    await updateIssueMutation.mutateAsync({
      issueId,
      projectId,
      payload: { title: titleValue.trim() },
    });
    setIsEditingTitle(false);
  };

  const handleSaveDesc = async () => {
    if (descValue === (issue?.description || '')) {
      setIsEditingDesc(false);
      return;
    }
    await updateIssueMutation.mutateAsync({
      issueId,
      projectId,
      payload: { description: descValue.trim() || null },
    });
    setIsEditingDesc(false);
  };

  const handleStatusChange = async (newColumnId: string) => {
    if (!newColumnId || newColumnId === issue?.column_id) return;
    await updateIssueMutation.mutateAsync({
      issueId,
      projectId,
      payload: { columnId: newColumnId },
    });
  };

  const handlePriorityChange = async (newPriority: Priority) => {
    if (newPriority === issue?.priority) return;
    await updateIssueMutation.mutateAsync({
      issueId,
      projectId,
      payload: { priority: newPriority },
    });
  };

  const handleAssigneeChange = async (newAssigneeId: string) => {
    await updateIssueMutation.mutateAsync({
      issueId,
      projectId,
      payload: { assigneeId: newAssigneeId || null },
    });
  };

  const handleDueDateChange = async (newDate: string) => {
    await updateIssueMutation.mutateAsync({
      issueId,
      projectId,
      payload: { dueDate: newDate || null },
    });
  };

  const handleDeleteIssue = async () => {
    await deleteIssueMutation.mutateAsync({
      issueId,
      projectId,
    });
    setIsDeleteDialogOpen(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-slate-950 border-l border-border-subtle shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header Bar */}
        <div className="h-16 px-6 border-b border-border-subtle flex items-center justify-between shrink-0 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
              {issue?.issue_key || '...'}
            </span>
            <span className="text-xs text-slate-400 font-medium">in {project.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Delete issue"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Close drawer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        {isLoading ? (
          <div className="p-6 flex flex-col gap-4">
            <LoadingSkeleton height="36px" width="70%" />
            <LoadingSkeleton height="100px" />
            <LoadingSkeleton height="40px" count={3} />
          </div>
        ) : issue ? (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {/* Title Section (Click to inline edit) */}
            <div>
              {isEditingTitle ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                    autoFocus
                    className="w-full bg-slate-900 text-white font-bold text-lg px-3 py-2 rounded-lg border border-indigo-500 outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTitle();
                      if (e.key === 'Escape') setIsEditingTitle(false);
                    }}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleSaveTitle}
                      isLoading={updateIssueMutation.isPending}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingTitle(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <h2
                  onClick={() => setIsEditingTitle(true)}
                  className="text-xl font-bold text-white tracking-tight cursor-pointer hover:bg-slate-900/80 p-1.5 -ml-1.5 rounded-lg transition-colors leading-snug"
                  title="Click to edit title"
                >
                  {issue.title}
                </h2>
              )}
            </div>

            {/* Meta Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/60 border border-border-subtle/80">
              {/* Status / Column */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={13} className="text-indigo-400" />
                  Status
                </span>
                <select
                  value={issue.column_id}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="bg-slate-800 text-slate-100 text-xs rounded-lg px-3 py-1.5 border border-border-subtle focus:border-indigo-500 outline-none cursor-pointer"
                >
                  {(project.columns || []).map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag size={13} className="text-amber-400" />
                  Priority
                </span>
                <div className="flex items-center gap-2">
                  <select
                    value={issue.priority}
                    onChange={(e) => handlePriorityChange(e.target.value as Priority)}
                    className="bg-slate-800 text-slate-100 text-xs rounded-lg px-3 py-1.5 border border-border-subtle focus:border-indigo-500 outline-none cursor-pointer"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                  <Badge priority={issue.priority}>{issue.priority}</Badge>
                </div>
              </div>

              {/* Assignee */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <UserIcon size={13} className="text-blue-400" />
                  Assignee
                </span>
                <div className="flex items-center gap-2">
                  {issue.assignee && (
                    <Avatar
                      name={issue.assignee.name}
                      color={issue.assignee.avatar_color}
                      size="sm"
                    />
                  )}
                  <select
                    value={issue.assignee_id || ''}
                    onChange={(e) => handleAssigneeChange(e.target.value)}
                    className="flex-1 bg-slate-800 text-slate-100 text-xs rounded-lg px-3 py-1.5 border border-border-subtle focus:border-indigo-500 outline-none cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {(project.members || []).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar size={13} className="text-emerald-400" />
                  Due Date
                </span>
                <input
                  type="date"
                  value={issue.due_date ? issue.due_date.slice(0, 10) : ''}
                  onChange={(e) => handleDueDateChange(e.target.value)}
                  className="bg-slate-800 text-slate-100 text-xs rounded-lg px-3 py-1.5 border border-border-subtle focus:border-indigo-500 outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Description Section */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Description
                </span>
                {!isEditingDesc && (
                  <button
                    onClick={() => setIsEditingDesc(true)}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditingDesc ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={descValue}
                    onChange={(e) => setDescValue(e.target.value)}
                    rows={4}
                    autoFocus
                    className="w-full bg-slate-900/90 text-slate-100 border border-indigo-500 rounded-xl p-3 text-xs resize-y outline-none leading-relaxed"
                    placeholder="Add detailed description, reproduction steps, or requirements..."
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleSaveDesc}
                      isLoading={updateIssueMutation.isPending}
                    >
                      Save Description
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingDesc(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingDesc(true)}
                  className="p-3.5 rounded-xl bg-slate-900/40 border border-border-subtle/60 text-xs text-slate-300 leading-relaxed cursor-pointer hover:border-slate-700 transition-colors min-h-[70px] whitespace-pre-wrap"
                >
                  {issue.description || (
                    <span className="text-slate-500 italic">No description provided. Click to add.</span>
                  )}
                </div>
              )}
            </div>

            {/* Reporter & Timestamps */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-border-subtle/60 pt-3">
              <div className="flex items-center gap-1.5">
                <span>Reported by</span>
                <span className="font-semibold text-slate-300">
                  {issue.reporter?.name || 'Team Member'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span>Created {formatDate(issue.created_at)}</span>
                <span>•</span>
                <span>Updated {formatDate(issue.updated_at)}</span>
              </div>
            </div>

            {/* Comments Timeline */}
            <CommentsSection issueId={issueId} projectId={projectId} />
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm">Issue not found.</div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteIssue}
        title="Delete Issue"
        message={`Are you sure you want to permanently delete issue ${issue?.issue_key}? All associated comments will also be removed.`}
        confirmText="Delete"
        isDestructive={true}
        isLoading={deleteIssueMutation.isPending}
      />
    </>
  );
};
