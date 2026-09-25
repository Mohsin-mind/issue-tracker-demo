import React, { useState, useEffect } from 'react';
import { Modal, Input, Textarea, Button, Avatar } from '../common';
import { useCreateProject } from '../../hooks/useProjects';
import { useUsers } from '../../hooks/useUsers';

export interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { data: users } = useUsers();
  const createProjectMutation = useCreateProject();

  // Pre-select all users by default
  useEffect(() => {
    if (users && users.length > 0 && selectedMemberIds.length === 0) {
      setSelectedMemberIds(users.map((u) => u.id));
    }
  }, [users]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    if (!key.trim()) {
      setError('Project key is required');
      return;
    }

    try {
      await createProjectMutation.mutateAsync({
        name: name.trim(),
        key: key.trim().toUpperCase(),
        description: description.trim() || undefined,
        memberIds: selectedMemberIds.length > 0 ? selectedMemberIds : undefined,
      });
      setName('');
      setKey('');
      setDescription('');
      setSelectedMemberIds([]);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={createProjectMutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={createProjectMutation.isPending}
          >
            Create Project
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-1">
        {error && (
          <div className="p-[14px] bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
            {error}
          </div>
        )}

        <Input
          label="Project Name"
          placeholder="e.g. Mobile Application Redesign"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            // Suggest uppercase prefix key
            if (!key) {
              const suggested = e.target.value
                .trim()
                .split(/\s+/)
                .map((w) => w[0])
                .join('')
                .toUpperCase()
                .slice(0, 5);
              setKey(suggested);
            }
          }}
          required
        />

        <Input
          label="Project Key"
          placeholder="e.g. MOB"
          value={key}
          onChange={(e) => setKey(e.target.value.toUpperCase())}
          helperText="Unique uppercase prefix for all issues (e.g. MOB-1, MOB-2)"
          required
        />

        <Textarea
          label="Description"
          placeholder="Describe the scope, objectives, and deliverables of this project..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        {/* Team Members Selection */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Project Team Members
            </label>
            <span className="text-[11px] text-slate-500 font-medium">
              {selectedMemberIds.length} of {users?.length || 0} selected
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1.5 border border-slate-200 rounded-xl bg-slate-50/50">
            {users?.map((u) => {
              const isSelected = selectedMemberIds.includes(u.id);
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    setSelectedMemberIds((prev) =>
                      isSelected ? prev.filter((id) => id !== u.id) : [...prev, u.id]
                    );
                  }}
                  className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-white border-indigo-200 shadow-2xs text-slate-900'
                      : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="rounded text-indigo-600 focus:ring-indigo-500 pointer-events-none"
                  />
                  <Avatar name={u.name} color={u.avatar_color} size="sm" />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-semibold truncate leading-tight">{u.name}</span>
                    <span className="text-[10px] text-slate-400 truncate leading-tight">{u.email}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </Modal>
  );
};
