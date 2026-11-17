'use client';

import type { ChipProps } from './Chip.shared';

const Check = () => (
  <svg className="ds-chip__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

/** A bordered, toggleable filter or choice, like "Food" or "Last 30 days" */
export function Chip({ label, selected = false, onSelectedChange, icon, disabled, size = 'md', testID }: ChipProps) {
  return (
    <button
      type="button"
      className={`ds-chip ds-chip--${size} ds-press ds-press--object`}
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onSelectedChange?.(!selected)}
      data-testid={testID}
    >
      {selected ? <Check /> : icon}
      {label}
    </button>
  );
}
