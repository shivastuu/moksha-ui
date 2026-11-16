'use client';

import { useEffect, useId, useRef } from 'react';
import { useControllableState } from '../utils/useControllableState';
import type { CheckboxProps } from './Checkbox.shared';

/** A checkbox on a real input (keyboard, forms), drawn with a check mark that draws itself in */
export function Checkbox({ checked, defaultChecked = false, onCheckedChange, label, description, accessibilityLabel, disabled, name, testID }: CheckboxProps) {
  const mixed = checked === 'mixed';
  const [on, setOn] = useControllableState(mixed ? false : checked, defaultChecked, onCheckedChange);
  const id = useId();
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.current) {
      input.current.indeterminate = mixed;
    }
  }, [mixed]);

  return (
    <label className="ds-control-row ds-checkbox-row" htmlFor={id} data-disabled={disabled || undefined}>
      <span className="ds-checkbox" data-state={mixed ? 'mixed' : on ? 'checked' : 'unchecked'}>
        <input
          ref={input}
          id={id}
          type="checkbox"
          className="ds-checkbox__input"
          name={name}
          checked={on}
          onChange={(event) => setOn(event.target.checked)}
          disabled={disabled}
          aria-label={label ? undefined : accessibilityLabel}
          aria-labelledby={label ? `${id}-label` : undefined}
          aria-describedby={description ? `${id}-description` : undefined}
          data-testid={testID}
        />
        <svg className="ds-checkbox__mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {mixed ? <path d="M6 12h12" pathLength="1" /> : <path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1" />}
        </svg>
      </span>
      {label && (
        <span className="ds-control-row__text">
          <span id={`${id}-label`} className="ds-control-row__label">
            {label}
          </span>
          {description && (
            <span id={`${id}-description`} className="ds-control-row__description">
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
}
