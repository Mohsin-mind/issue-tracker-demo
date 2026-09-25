import React from 'react';

interface EpicBadgeProps {
  name: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md';
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export const EpicBadge: React.FC<EpicBadgeProps> = ({
  name,
  color = '#8b5cf6',
  size = 'xs',
  onClick,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'text-[11px] px-2 py-0.5 max-w-[160px]',
    sm: 'text-xs px-2.5 py-0.5 max-w-[200px]',
    md: 'text-sm px-3 py-1 max-w-[240px]',
  };

  return (
    <span
      onClick={onClick}
      style={{
        backgroundColor: `${color}15`,
        borderColor: `${color}40`,
        color: color,
      }}
      className={`inline-flex items-center gap-1 font-semibold uppercase tracking-wider rounded-md border truncate transition-all ${
        onClick ? 'cursor-pointer hover:opacity-85' : ''
      } ${sizeClasses[size]} ${className}`}
      title={`Epic: ${name}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="truncate">{name}</span>
    </span>
  );
};
