'use client';

import type { DividerProps } from './Divider.shared';

/** A hairline between content, optionally with a label in the middle */
export function Divider({ orientation = 'horizontal', label, testID }: DividerProps) {
  if (orientation === 'vertical') {
    return <div className="ds-divider ds-divider--vertical" role="separator" aria-orientation="vertical" data-testid={testID} />;
  }
  if (label) {
    return (
      <div className="ds-divider ds-divider--labelled" role="separator" data-testid={testID}>
        <span>{label}</span>
      </div>
    );
  }
  return <hr className="ds-divider" data-testid={testID} />;
}
