import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';

describe('Input Component', () => {
  it('renders input with label and helper text', () => {
    render(<Input label="Username" helperText="Enter your unique handle" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByText('Enter your unique handle')).toBeInTheDocument();
  });

  it('renders error message when error is provided', () => {
    render(<Input label="Email" error="Invalid email address" />);
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
  });

  it('accepts user typing', () => {
    const handleChange = vi.fn();
    render(<Input label="Search" onChange={handleChange} placeholder="Type here" />);
    const input = screen.getByPlaceholderText('Type here');
    fireEvent.change(input, { target: { value: 'Frontend testing' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('disables input when disabled prop is true', () => {
    render(<Input label="Locked" disabled placeholder="Cannot edit" />);
    expect(screen.getByPlaceholderText('Cannot edit')).toBeDisabled();
  });
});
