import React from 'react';
import { IssueType } from '../../types';

interface IssueTypeIconProps {
  type?: IssueType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const IssueTypeIcon: React.FC<IssueTypeIconProps> = ({
  type = 'TASK',
  size = 'sm',
  showLabel = false,
  className = '',
}) => {
  const sizeMap = {
    xs: { icon: 'w-3 h-3', text: 'text-[10px]', box: 'w-3.5 h-3.5' },
    sm: { icon: 'w-3.5 h-3.5', text: 'text-xs', box: 'w-4 h-4' },
    md: { icon: 'w-4 h-4', text: 'text-xs', box: 'w-5 h-5' },
    lg: { icon: 'w-5 h-5', text: 'text-sm', box: 'w-6 h-6' },
  };

  const currentSize = sizeMap[size] || sizeMap.sm;

  let iconElement: React.ReactNode;
  let labelText = 'Task';
  let badgeColor = 'bg-blue-50 text-blue-600 border-blue-200';

  switch (type) {
    case 'STORY':
      labelText = 'Story';
      badgeColor = 'bg-emerald-50 text-emerald-600 border-emerald-200';
      iconElement = (
        <span
          title="Story"
          className={`inline-flex items-center justify-center rounded-sm bg-emerald-500 text-white shrink-0 ${currentSize.box} shadow-xs`}
        >
          <svg className={currentSize.icon} viewBox="0 0 16 16" fill="currentColor">
            <path d="M3 2.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.79.407L8 10.94l-4.21 2.967A.5.5 0 0 1 3 13.5v-11z" />
          </svg>
        </span>
      );
      break;

    case 'BUG':
      labelText = 'Bug';
      badgeColor = 'bg-rose-50 text-rose-600 border-rose-200';
      iconElement = (
        <span
          title="Bug"
          className={`inline-flex items-center justify-center rounded-sm bg-rose-500 text-white shrink-0 ${currentSize.box} shadow-xs`}
        >
          <svg className={currentSize.icon} viewBox="0 0 16 16" fill="currentColor">
            <circle cx="8" cy="8" r="4.5" />
            <path d="M4 8H2m12 0h-2M5.5 5.5 3.7 3.7m8.6 0-1.8 1.8M5.5 10.5 3.7 12.3m8.6 0-1.8-1.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      );
      break;

    case 'TASK':
    default:
      labelText = 'Task';
      badgeColor = 'bg-blue-50 text-blue-600 border-blue-200';
      iconElement = (
        <span
          title="Task"
          className={`inline-flex items-center justify-center rounded-sm bg-blue-500 text-white shrink-0 ${currentSize.box} shadow-xs`}
        >
          <svg className={currentSize.icon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.5 8.5l3 3 6-6" />
          </svg>
        </span>
      );
      break;
  }

  if (showLabel) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-xs font-medium ${badgeColor} ${className}`}>
        {iconElement}
        <span className={currentSize.text}>{labelText}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center shrink-0 ${className}`}>
      {iconElement}
    </span>
  );
};
