'use client';

import type { ReactNode } from 'react';

export interface FieldShellProps {
  inputId: string;
  messageId: string;
  label: string;
  hideLabel?: boolean;
  required?: boolean;
  message?: string;
  invalid?: boolean;
  disabled?: boolean;
  size?: 'md' | 'lg';
  children: ReactNode;
}

/** Label, input area and helper or error text, wired together for screen readers */
export function FieldShell({
  inputId,
  messageId,
  label,
  hideLabel,
  required,
  message,
  invalid,
  disabled,
  size = 'md',
  children,
}: FieldShellProps) {
  const className = ['ds-field', `ds-field--${size}`, invalid && 'ds-field--invalid', disabled && 'ds-field--disabled']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className}>
      <label htmlFor={inputId} className={hideLabel ? 'ds-field__label ds-visually-hidden' : 'ds-field__label'}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {message && (
        <p id={messageId} className="ds-field__message">
          {message}
        </p>
      )}
    </div>
  );
}
