import React from 'react';

export interface AvatarProps {
  name?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name = 'User',
  color = '#6366f1',
  size = 'md',
  showName = false,
  className = '',
}) => {
  const initial = name.trim().charAt(0).toUpperCase() || 'U';

  return (
    <div className={`avatar-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <div
        className={`avatar-circle avatar-${size}`}
        style={{ backgroundColor: color }}
        title={name}
      >
        {initial}
      </div>
      {showName && (
        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>
          {name}
        </span>
      )}
    </div>
  );
};
