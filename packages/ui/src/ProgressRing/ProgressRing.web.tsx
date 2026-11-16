'use client';

import { useTheme } from '../theme/context';
import { progressFraction } from '../ProgressBar/ProgressBar.shared';
import type { ProgressRingProps } from './ProgressRing.shared';

/** A circular gauge whose arc springs to its value */
export function ProgressRing({ value, max = 100, label, tone = 'primary', size, thickness, children, testID }: ProgressRingProps) {
  const { components } = useTheme();
  const diameter = size ?? components.progress.ring.size;
  // The SVG is 100 units wide whatever its size, so the stroke is scaled to keep `thickness` in px
  const stroke = ((thickness ?? components.progress.ring.thickness) * 100) / diameter;
  const radius = 50 - stroke / 2;
  const fraction = progressFraction(value, max) ?? 0;
  return (
    <div
      className={`ds-ring ds-ring--${tone}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      data-testid={testID}
      style={{ width: diameter, height: diameter }}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className="ds-ring__track" cx="50" cy="50" r={radius} strokeWidth={stroke} />
        <circle className="ds-ring__arc" cx="50" cy="50" r={radius} strokeWidth={stroke} pathLength="100" strokeDasharray={`${fraction * 100} 100`} />
      </svg>
      {children !== undefined && <div className="ds-ring__center">{children}</div>}
    </div>
  );
}
