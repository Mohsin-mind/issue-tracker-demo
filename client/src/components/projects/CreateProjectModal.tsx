import React, { useState } from 'react';
import { Modal, Input, Textarea, Button } from '../common';
import { useCreateProject } from '../../hooks/useProjects';

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
  const [error, setError] = useState<string | null>(null);

  const createProjectMutation = useCreateProject();

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
      });
      setName('');
      setKey('');
      setDescription('');
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-lg text-red-400 text-xs font-medium">
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
      </form>
    </Modal>
  );
};
