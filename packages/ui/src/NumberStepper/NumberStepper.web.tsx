'use client';

import { useId, useRef, type KeyboardEvent } from 'react';
import { useControllableState } from '../utils/useControllableState';
import { clampValue, type NumberStepperProps } from './NumberStepper.shared';

/** − 2 +, with the new number rolling in from the side it came from. A WAI-ARIA spinbutton */
export function NumberStepper({ label, value, defaultValue, onValueChange, min = 0, max = Infinity, step = 1, format = String, disabled, testID }: NumberStepperProps) {
  const [current, setCurrent] = useControllableState(value, defaultValue ?? min, onValueChange);
  const direction = useRef<'up' | 'down'>(undefined);
  const id = useId();

  const set = (next: number) => {
    const clamped = clampValue(next, min, max);
    if (disabled || clamped === current) {
      return;
    }
    direction.current = clamped > current ? 'up' : 'down';
    setCurrent(clamped);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const next = { ArrowUp: current + step, ArrowRight: current + step, ArrowDown: current - step, ArrowLeft: current - step, Home: min, End: max }[event.key];
    if (next !== undefined && Number.isFinite(next)) {
      event.preventDefault();
      set(next);
    }
  };

  return (
    <div className={`ds-stepper${disabled ? ' ds-stepper--disabled' : ''}`} data-testid={testID}>
      <span id={id} className="ds-stepper__label">
        {label}
      </span>
      <div className="ds-stepper__control">
        {/* The buttons stay out of the tab order: the spinbutton takes the arrow keys */}
        <button type="button" tabIndex={-1} className="ds-stepper__button ds-press ds-press--object" aria-label={`Decrease ${label}`} disabled={disabled || current <= min} onClick={() => set(current - step)}>
          −
        </button>
        <span
          role="spinbutton"
          tabIndex={disabled ? -1 : 0}
          className="ds-stepper__value"
          aria-labelledby={id}
          aria-valuenow={current}
          aria-valuemin={min}
          aria-valuemax={Number.isFinite(max) ? max : undefined}
          aria-valuetext={format(current)}
          aria-disabled={disabled || undefined}
          onKeyDown={onKeyDown}
        >
          <span key={current} className="ds-stepper__number" data-direction={direction.current}>
            {format(current)}
          </span>
        </span>
        <button type="button" tabIndex={-1} className="ds-stepper__button ds-press ds-press--object" aria-label={`Increase ${label}`} disabled={disabled || current >= max} onClick={() => set(current + step)}>
          +
        </button>
      </div>
    </div>
  );
}
