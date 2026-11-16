'use client';

import { useId } from 'react';
import { useControllableState } from '../utils/useControllableState';
import type { SwitchProps } from './Switch.shared';

/** An on/off switch. The thumb glides on a spring and stretches while pressed, like iOS */
export function Switch({ checked, defaultChecked = false, onCheckedChange, label, description, accessibilityLabel, disabled, testID }: SwitchProps) {
  const [on, setOn] = useControllableState(checked, defaultChecked, onCheckedChange);
  const id = useId();
  const control = (
    <button
      type="button"
      role="switch"
      id={id}
      className="ds-switch"
      aria-checked={on}
      aria-label={label ? undefined : accessibilityLabel}
      aria-labelledby={label ? `${id}-label` : undefined}
      aria-describedby={description ? `${id}-description` : undefined}
      disabled={disabled}
      onClick={() => setOn(!on)}
      data-testid={testID}
    >
      <span className="ds-switch__thumb" />
    </button>
  );
  if (!label) {
    return control;
  }
  return (
    <label className="ds-control-row" htmlFor={id} data-disabled={disabled || undefined}>
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
      {control}
    </label>
  );
}
