'use client';

import { spinnerSizes, type SpinnerProps } from './Spinner.shared';

/** An arc that spins on a faint track. Keeps spinning (slower) with reduced motion, since it shows work in progress */
export function Spinner({ size = 'md', tone = 'primary', label = 'Loading', testID }: SpinnerProps) {
  const pixels = spinnerSizes[size];
  return (
    <span
      className={`ds-loader ds-loader--${tone}`}
      role="progressbar"
      aria-label={label}
      data-testid={testID}
      style={{ width: pixels, height: pixels }}
    >
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
        <circle className="ds-loader__track" cx="12" cy="12" r="9.5" />
        <circle className="ds-loader__arc" cx="12" cy="12" r="9.5" pathLength="100" strokeDasharray="28 100" />
      </svg>
    </span>
  );
}
