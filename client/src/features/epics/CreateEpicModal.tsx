import React, { useState } from 'react';
import { Modal, Button, Input, Textarea, Select } from '../../components/common';
import { useCreateEpic } from '../../hooks/useEpics';
import { EpicStatus } from '../../types';

interface CreateEpicModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const PRESET_COLORS = [
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#ec4899', // Pink
  '#6366f1', // Indigo
];

export const CreateEpicModal: React.FC<CreateEpicModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [status, setStatus] = useState<EpicStatus>('TODO');
  const [error, setError] = useState<string | null>(null);

  const createEpicMutation = useCreateEpic(projectId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Epic name is required');
      return;
    }

    try {
      setError(null);
      await createEpicMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        color,
        status,
      });

      setName('');
      setDescription('');
      setColor(PRESET_COLORS[0]);
      setStatus('TODO');
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || err.message || 'Failed to create epic');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Epic" size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <Input
          label="Epic Name *"
          placeholder="e.g. User Authentication & RBAC"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(null);
          }}
          autoFocus
        />

        <Textarea
          label="Description"
          placeholder="Describe the overall scope and deliverable of this epic..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        {/* Color Palette Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-700">Epic Color</label>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                  color === c
                    ? 'ring-3 ring-indigo-500 ring-offset-2 scale-110 shadow-sm'
                    : 'hover:scale-105 opacity-80 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>

        <Select
          label="Initial Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as EpicStatus)}
          options={[
            { value: 'TODO', label: 'To Do' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'DONE', label: 'Done' },
          ]}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={createEpicMutation.isPending}>
            Create Epic
          </Button>
        </div>
      </form>
    </Modal>
  );
};
