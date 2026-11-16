'use client';

import { flexAlign, flexJustify, type StackProps } from './Stack.shared';

/** Lays children out in a row or column with even spacing from the theme */
export function Stack({ children, direction = 'column', gap = 'md', align = 'stretch', justify = 'start', wrap, testID }: StackProps) {
  return (
    <div
      data-testid={testID}
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: `var(--ds-space-${gap})`,
        alignItems: flexAlign(align),
        justifyContent: flexJustify(justify),
        flexWrap: wrap ? 'wrap' : undefined,
        minWidth: 0,
      }}
    >
      {children}
    </div>
  );
}
