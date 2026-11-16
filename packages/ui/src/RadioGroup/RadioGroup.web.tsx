'use client';

import { useId } from 'react';
import { useControllableState } from '../utils/useControllableState';
import type { RadioGroupProps } from './RadioGroup.shared';

/** One choice from a few, as bordered option cards on real radio inputs (arrow keys, forms) */
export function RadioGroup({ label, options, value, defaultValue = '', onValueChange, disabled, name, testID }: RadioGroupProps) {
  const [selected, setSelected] = useControllableState(value, defaultValue, onValueChange);
  const id = useId();
  return (
    <fieldset className="ds-radio-group" disabled={disabled} data-testid={testID}>
      <legend className="ds-radio-group__legend">{label}</legend>
      {options.map((option) => (
        <label key={option.value} className="ds-radio" data-checked={selected === option.value || undefined} data-disabled={option.disabled || disabled || undefined}>
          <input
            type="radio"
            className="ds-radio__input"
            name={name ?? id}
            value={option.value}
            checked={selected === option.value}
            onChange={() => setSelected(option.value)}
            disabled={option.disabled}
            aria-labelledby={`${id}-${option.value}-label`}
            aria-describedby={option.description ? `${id}-${option.value}` : undefined}
          />
          <span className="ds-radio__dot" aria-hidden="true" />
          <span className="ds-control-row__text">
            <span id={`${id}-${option.value}-label`} className="ds-control-row__label">
              {option.label}
            </span>
            {option.description && (
              <span id={`${id}-${option.value}`} className="ds-control-row__description">
                {option.description}
              </span>
            )}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
