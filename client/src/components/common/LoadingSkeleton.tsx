import React from 'react';

export interface LoadingSkeletonProps {
  type?: 'card' | 'text' | 'avatar' | 'column';
  count?: number;
  height?: string | number;
  width?: string | number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'text',
  count = 1,
  height,
  width,
  className = '',
}) => {
  const elements = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="flex flex-col gap-3">
        {elements.map((_, i) => (
          <div
            key={i}
            className={`skeleton rounded-xl ${className}`}
            style={{
              height: height || '110px',
              width: width || '100%',
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'avatar') {
    return (
      <div
        className={`skeleton rounded-full shrink-0 ${className}`}
        style={{
          width: width || '34px',
          height: height || '34px',
        }}
      />
    );
  }

  if (type === 'column') {
    return (
      <div
        className={`skeleton rounded-xl shrink-0 ${className}`}
        style={{
          height: height || '480px',
          width: width || '280px',
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {elements.map((_, i) => (
        <div
          key={i}
          className={`skeleton rounded ${className}`}
          style={{
            height: height || '16px',
            width: width || (i === count - 1 ? '70%' : '100%'),
          }}
        />
      ))}
    </div>
  );
};
