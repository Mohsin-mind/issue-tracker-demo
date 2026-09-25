import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge Component', () => {
  it('renders children correctly', () => {
    render(<Badge>Feature</Badge>);
    expect(screen.getByText('Feature')).toBeInTheDocument();
  });

  it('applies priority styling class when priority is passed', () => {
    const { container } = render(<Badge priority="URGENT">URGENT</Badge>);
    const badge = container.querySelector('.badge-pill');
    expect(badge).toBeInTheDocument();
    expect(badge?.className).toContain('badge-urgent');
  });

  it('applies custom inline styles when color is provided', () => {
    const { container } = render(<Badge color="#10b981">Custom Color</Badge>);
    const badge = container.querySelector('.badge-pill');
    expect(badge).toHaveStyle({ color: 'rgb(16, 185, 129)' });
  });
});
