'use client';

import type { TagProps } from './Tag.shared';

/** A small bordered status pill, like "Paid", "KYC pending" or "Blocked" */
export function Tag({ children, tone = 'neutral', dot, icon, size = 'md', testID }: TagProps) {
  return (
    <span className={`ds-tag ds-tag--${tone} ds-tag--${size}`} data-testid={testID}>
      {icon ?? (dot && <span className="ds-tag__dot" aria-hidden="true" />)}
      {children}
    </span>
  );
}
