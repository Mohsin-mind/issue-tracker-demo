import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EpicBadge } from '../EpicBadge';
import { IssueTypeIcon } from '../IssueTypeIcon';

describe('Phase 8: EpicBadge Component', () => {
  it('renders epic name with dot and correct style', () => {
    render(<EpicBadge name="User Authentication" color="#8b5cf6" />);
    const badge = screen.getByText('User Authentication');
    expect(badge).toBeInTheDocument();
    expect(badge.parentElement).toHaveAttribute('title', 'Epic: User Authentication');
  });
});

describe('Phase 8: IssueTypeIcon Component', () => {
  it('renders Story type with label when requested', () => {
    render(<IssueTypeIcon type="STORY" showLabel />);
    expect(screen.getByText('Story')).toBeInTheDocument();
    expect(screen.getByTitle('Story')).toBeInTheDocument();
  });

  it('renders Bug type with label when requested', () => {
    render(<IssueTypeIcon type="BUG" showLabel />);
    expect(screen.getByText('Bug')).toBeInTheDocument();
    expect(screen.getByTitle('Bug')).toBeInTheDocument();
  });

  it('renders Task type with label when requested', () => {
    render(<IssueTypeIcon type="TASK" showLabel />);
    expect(screen.getByText('Task')).toBeInTheDocument();
    expect(screen.getByTitle('Task')).toBeInTheDocument();
  });
});
