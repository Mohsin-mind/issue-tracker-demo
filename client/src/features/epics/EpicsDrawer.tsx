import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2, Clock, ListFilter } from 'lucide-react';
import { Button, ConfirmDialog } from '../../components/common';
import { useEpics, useDeleteEpic } from '../../hooks/useEpics';
import { CreateEpicModal } from './CreateEpicModal';
import { Epic } from '../../types';

interface EpicsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onSelectEpicFilter?: (epicId: string) => void;
  activeEpicFilter?: string;
}

export const EpicsDrawer: React.FC<EpicsDrawerProps> = ({
  isOpen,
  onClose,
  projectId,
  onSelectEpicFilter,
  activeEpicFilter,
}) => {
  const { data: epics, isLoading } = useEpics(projectId);
  const deleteEpicMutation = useDeleteEpic(projectId);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [epicToDelete, setEpicToDelete] = useState<Epic | null>(null);

  if (!isOpen) return null;

  const handleDeleteConfirm = async () => {
    if (!epicToDelete) return;
    await deleteEpicMutation.mutateAsync(epicToDelete.id);
    setEpicToDelete(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DONE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={11} /> Done
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock size={11} /> In Progress
          </span>
        );
      case 'TODO':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            To Do
          </span>
        );
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
        <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Project Epics</h3>
                {epics && epics.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold font-mono">
                    {epics.length}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Track high-level roadmap initiatives and progress across issues.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={14} />}
                onClick={() => setIsCreateOpen(true)}
              >
                New Epic
              </Button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Epics List */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
            {isLoading ? (
              <div className="flex flex-col gap-3 py-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : !epics || epics.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-6 border-2 border-dashed border-slate-200 rounded-2xl">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <ListFilter size={24} />
                </div>
                <h4 className="text-sm font-bold text-slate-800">No Epics Created Yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mb-4">
                  Group your stories, bugs, and tasks into larger initiatives to track feature delivery.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus size={14} />}
                  onClick={() => setIsCreateOpen(true)}
                >
                  Create First Epic
                </Button>
              </div>
            ) : (
              epics.map((epic) => {
                const total = epic.issues_count ?? 0;
                const completed = epic.completed_count ?? 0;
                const percent = epic.progress_percent ?? 0;
                const isCurrentFilter = activeEpicFilter === epic.id;

                return (
                  <div
                    key={epic.id}
                    className={`p-4.5 rounded-2xl border transition-all flex flex-col gap-3 ${
                      isCurrentFilter
                        ? 'border-indigo-500 bg-indigo-50/20 shadow-xs'
                        : 'border-slate-200/90 hover:border-slate-300 bg-white shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                          style={{ backgroundColor: epic.color }}
                        />
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                          {epic.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {getStatusBadge(epic.status)}
                        <button
                          onClick={() => setEpicToDelete(epic)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Epic"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {epic.description && (
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {epic.description}
                      </p>
                    )}

                    {/* Progress Bar */}
                    <div className="flex flex-col gap-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span>
                          {completed} of {total} {total === 1 ? 'issue' : 'issues'} completed
                        </span>
                        <span className="font-mono">{percent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: epic.color,
                          }}
                        />
                      </div>
                    </div>

                    {/* Bottom Action: Filter by Epic */}
                    {onSelectEpicFilter && (
                      <div className="pt-2 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={() => onSelectEpicFilter(isCurrentFilter ? '' : epic.id)}
                          className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                            isCurrentFilter
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'text-indigo-600 hover:bg-indigo-50'
                          }`}
                        >
                          {isCurrentFilter ? '✓ Filtering Board' : 'Filter Board by this Epic'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Create Epic Modal */}
      <CreateEpicModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        projectId={projectId}
      />

      {/* Confirm Delete Epic Dialog */}
      <ConfirmDialog
        isOpen={Boolean(epicToDelete)}
        onClose={() => setEpicToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Epic"
        message={`Are you sure you want to delete "${epicToDelete?.name}"? The issues inside this epic will NOT be deleted; their epic association will safely be cleared.`}
        confirmText="Delete Epic"
        isDestructive={true}
        isLoading={deleteEpicMutation.isPending}
      />
    </>
  );
};
