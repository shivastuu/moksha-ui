'use client';

import { useRef, type KeyboardEvent } from 'react';
import { useControllableState } from '../utils/useControllableState';
import { nextIndex, type SegmentedControlProps } from './SegmentedControl.shared';

/** A row of choices with a pill that springs to the selected one. A radio group for screen readers and keyboards */
export function SegmentedControl({ options, value, defaultValue, onValueChange, accessibilityLabel, testID }: SegmentedControlProps) {
  const [selected, setSelected] = useControllableState(value, defaultValue ?? options[0]?.value ?? '', onValueChange);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const index = options.findIndex((option) => option.value === selected);

  const onKeyDown = (event: KeyboardEvent) => {
    const next = nextIndex(event.key, Math.max(index, 0), options.length);
    if (next === null) {
      return;
    }
    event.preventDefault();
    setSelected(options[next]!.value);
    buttons.current[next]?.focus();
  };

  return (
    <div
      className="ds-segmented"
      role="radiogroup"
      aria-label={accessibilityLabel}
      onKeyDown={onKeyDown}
      data-testid={testID}
      style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
    >
      {index >= 0 && (
        <span
          className="ds-segmented__indicator"
          aria-hidden="true"
          style={{ width: `calc((100% - 2 * var(--ds-segmented-inset)) / ${options.length})`, transform: `translateX(${index * 100}%)` }}
        />
      )}
      {options.map((option, position) => (
        <button
          key={option.value}
          ref={(element) => {
            buttons.current[position] = element;
          }}
          type="button"
          role="radio"
          className="ds-segmented__option"
          aria-checked={position === index}
          tabIndex={position === Math.max(index, 0) ? 0 : -1}
          onClick={() => setSelected(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
