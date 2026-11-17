import type { CSSProperties } from 'react';
import type { SuccessCheckProps } from './SuccessCheck.shared';

/** A green disc that springs in, a check that draws itself, and a ring that fades out. Plays once on mount */
export function SuccessCheck({ size = 72, accessibilityLabel = 'Success', testID }: SuccessCheckProps) {
  return (
    <span className="ds-success" role="img" aria-label={accessibilityLabel} data-testid={testID} style={{ '--ds-success-size': `${size}px` } as CSSProperties}>
      <span className="ds-success__ring" />
      <span className="ds-success__disc" />
      <svg className="ds-success__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {/* pathLength 1 lets the dash animation draw it start to end whatever its real length */}
        <path d="M6 12.5l4 4L18 8.5" pathLength={1} />
      </svg>
    </span>
  );
}
