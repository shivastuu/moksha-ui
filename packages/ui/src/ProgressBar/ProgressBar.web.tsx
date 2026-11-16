'use client';

import { progressFraction, type ProgressBarProps } from './ProgressBar.shared';

/** A bar whose fill springs to its value, or sweeps while the amount of work is unknown */
export function ProgressBar({ value, max = 100, label, tone = 'primary', size = 'md', testID }: ProgressBarProps) {
  const fraction = progressFraction(value, max);
  return (
    <div
      className={`ds-progress ds-progress--${size} ds-progress--${tone}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={fraction === undefined ? undefined : 0}
      aria-valuemax={fraction === undefined ? undefined : max}
      aria-valuenow={fraction === undefined ? undefined : value}
      data-indeterminate={fraction === undefined || undefined}
      data-testid={testID}
    >
      {/* Slides in from the left rather than stretching, so the rounded end keeps its shape */}
      <div className="ds-progress__fill" style={fraction === undefined ? undefined : { transform: `translateX(${(fraction - 1) * 100}%)` }} />
    </div>
  );
}
