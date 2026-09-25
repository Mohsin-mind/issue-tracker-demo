import React, { useState, useEffect } from 'react';
import { Project, Priority } from '../../types';
import { Modal, Input, Textarea, Select, Button } from '../../components/common';
import { useCreateIssue } from '../../hooks/useCreateIssue';
import { useUserStore } from '../../stores/userStore';

export interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  defaultColumnId?: string;
}

export const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  isOpen,
  onClose,
  project,
  defaultColumnId,
}) => {
  const { currentUser } = useUserStore();
  const createIssueMutation = useCreateIssue();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Sync default column when opening
  useEffect(() => {
    if (defaultColumnId) {
      setColumnId(defaultColumnId);
    } else if (project.columns && project.columns.length > 0) {
      setColumnId(project.columns[0].id);
    }
  }, [defaultColumnId, project.columns, isOpen]);

  const columnOptions = (project.columns || []).map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const priorityOptions = [
    { value: 'LOW', label: '🟢 Low' },
    { value: 'MEDIUM', label: '🟡 Medium' },
    { value: 'HIGH', label: '🟠 High' },
    { value: 'URGENT', label: '🔴 Urgent' },
  ];

  const assigneeOptions = [
    { value: '', label: 'Unassigned' },
    ...(project.members || []).map((m) => ({
      value: m.id,
      label: m.name,
    })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!columnId) {
      setError('Column is required');
      return;
    }

    if (!currentUser) {
      setError('Please select an active persona from the topbar');
      return;
    }

    try {
      await createIssueMutation.mutateAsync({
        projectId: project.id,
        columnId,
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        assigneeId: assigneeId || null,
        reporterId: currentUser.id,
        dueDate: dueDate || null,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setAssigneeId('');
      setDueDate('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create issue');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Create Issue in ${project.name}`}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={createIssueMutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={createIssueMutation.isPending}
          >
            Create Issue
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
            {error}
          </div>
        )}

        <Input
          label="Title"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Column"
            value={columnId}
            onChange={(e) => setColumnId(e.target.value)}
            options={columnOptions}
            required
          />

          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            options={priorityOptions}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Assignee"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            options={assigneeOptions}
            helperText="Assign to project member"
          />

          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <Textarea
          label="Description"
          placeholder="Provide acceptance criteria, repro steps, or implementation notes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </form>
    </Modal>
  );
};
