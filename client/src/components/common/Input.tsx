import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, required, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="form-field">
        {label && (
          <label htmlFor={inputId} className={`form-label ${required ? 'required' : ''}`}>
            {label}
          </label>
        )}
        <div className="input-wrapper">
          {icon && <span className="input-icon-left">{icon}</span>}
          <input
            id={inputId}
            ref={ref}
            required={required}
            className={`input-control ${icon ? 'has-icon-left' : ''} ${error ? 'has-error' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <span className="form-error">{error}</span>}
        {!error && helperText && <span className="form-helper">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
