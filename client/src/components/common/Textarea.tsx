import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, required, className = '', id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="form-field">
        {label && (
          <label htmlFor={textareaId} className={`form-label ${required ? 'required' : ''}`}>
            {label}
          </label>
        )}
        <div className="input-wrapper">
          <textarea
            id={textareaId}
            ref={ref}
            required={required}
            className={`input-control ${error ? 'has-error' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <span className="form-error">{error}</span>}
        {!error && helperText && <span className="form-helper">{helperText}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
