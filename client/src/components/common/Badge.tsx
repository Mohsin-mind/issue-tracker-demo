import React from 'react';
import { Priority } from '../../types';
import { getPriorityBadgeClass } from '../../utils/formatters';

export interface BadgeProps {
  priority?: Priority;
  color?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  priority,
  color,
  children,
  className = '',
  onClick,
}) => {
  const priorityClass = priority ? getPriorityBadgeClass(priority) : '';
  const customStyle: React.CSSProperties = color
    ? {
        backgroundColor: `${color}25`,
        color: color,
        border: `1px solid ${color}40`,
      }
    : {};

  return (
    <span
      className={`badge-pill ${priorityClass} ${className}`}
      style={customStyle}
      onClick={onClick}
    >
      {children}
    </span>
  );
};
