import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, required, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="form-field">
        {label && (
          <label htmlFor={selectId} className={`form-label ${required ? 'required' : ''}`}>
            {label}
          </label>
        )}
        <div className="input-wrapper">
          <select
            id={selectId}
            ref={ref}
            required={required}
            className={`input-control select-control ${error ? 'has-error' : ''} ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ background: '#1e293b', color: '#fff' }}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {error && <span className="form-error">{error}</span>}
        {!error && helperText && <span className="form-helper">{helperText}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
