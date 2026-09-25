import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from '../Avatar';

describe('Avatar Component', () => {
  it('renders first initial of name', () => {
    render(<Avatar name="Sarah Connor" />);
    expect(screen.getByText('S')).toBeInTheDocument();
  });

  it('renders fallback initial U when name is omitted', () => {
    render(<Avatar />);
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  it('renders full name text when showName is true', () => {
    render(<Avatar name="John Smith" showName />);
    expect(screen.getByText('John Smith')).toBeInTheDocument();
  });

  it('applies provided avatar background color', () => {
    render(<Avatar name="David" color="#ec4899" />);
    const circle = screen.getByTitle('David');
    expect(circle).toHaveStyle({ backgroundColor: 'rgb(236, 72, 153)' });
  });
});
