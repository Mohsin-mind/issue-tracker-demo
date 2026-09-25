import { Priority } from '../types';

export const formatIssueKey = (projectKey?: string, issueNumber?: number): string => {
  if (!projectKey || issueNumber === undefined) return '';
  return `${projectKey.toUpperCase()}-${issueNumber}`;
};

export const formatDate = (dateString?: string | null): string => {
  if (!dateString) return 'None';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const formatRelativeTime = (dateString?: string | null): string => {
  if (!dateString) return '';
  try {
    const now = new Date().getTime();
    const past = new Date(dateString).getTime();
    const diffSeconds = Math.floor((now - past) / 1000);

    if (diffSeconds < 60) return 'just now';
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
};

export const getPriorityBadgeClass = (priority: Priority): string => {
  switch (priority) {
    case 'LOW':
      return 'badge-low';
    case 'MEDIUM':
      return 'badge-medium';
    case 'HIGH':
      return 'badge-high';
    case 'URGENT':
      return 'badge-urgent';
    default:
      return 'badge-medium';
  }
};
