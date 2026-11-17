'use client';

import { useId } from 'react';
import { ChevronIcon } from '../Icon/ChevronIcon.web';
import { useShakeOnError } from '../motion/useShakeOnError';
import { FieldShell } from '../TextField/FieldShell.web';
import { useControllableState } from '../utils/useControllableState';
import type { SelectProps } from './Select.shared';

/** A field that picks one option from a list, on the browser's own select */
export function Select({ label, options, value, defaultValue = '', onValueChange, placeholder, helperText, error, disabled, required, name, testID }: SelectProps) {
  const [selected, setSelected] = useControllableState(value, defaultValue, onValueChange);
  const [shaking, shakeDone] = useShakeOnError(error);
  const id = useId();
  const message = error ?? helperText;
  return (
    <FieldShell inputId={id} messageId={`${id}-message`} label={label} required={required} message={message} invalid={!!error} disabled={disabled}>
      <div className={`ds-field__control ds-field__control--outline ds-select${shaking ? ' ds-field__control--shake' : ''}`} onAnimationEnd={(event) => event.animationName === 'ds-shake' && shakeDone()}>
        <select
          id={id}
          name={name}
          className="ds-field__input ds-select__input"
          value={selected}
          onChange={(event) => setSelected(event.target.value)}
          disabled={disabled}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={message ? `${id}-message` : undefined}
          data-empty={selected === '' || undefined}
          data-testid={testID}
        >
          {placeholder !== undefined && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronIcon direction="down" className="ds-select__chevron" />
      </div>
    </FieldShell>
  );
}
