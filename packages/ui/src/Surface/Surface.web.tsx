'use client';

import type { CSSProperties } from 'react';
import { resolveShadow, type SurfaceProps } from './Surface.shared';

export function Surface({
  children,
  variant = 'solid',
  padding = 'lg',
  radius = 'lg',
  blur = 'md',
  shadow,
  testID,
}: SurfaceProps) {
  const resolvedShadow = resolveShadow(variant, shadow);
  const style = {
    padding: `var(--ds-space-${padding})`,
    borderRadius: `var(--ds-radius-${radius})`,
    boxShadow:
      [
        resolvedShadow === 'none' ? '' : `var(--ds-shadow-${resolvedShadow})`,
        variant === 'raised' ? '0 0 0 1px var(--ds-surface-edge)' : '',
        variant === 'glass' ? 'inset 0 1px 0 var(--ds-surface-highlight)' : '',
      ]
        .filter(Boolean)
        .join(', ') || undefined,
    '--ds-surface-blur': `var(--ds-glass-blur-${blur})`,
  } as CSSProperties;

  return (
    <div className={`ds-surface ds-surface--${variant}`} style={style} data-testid={testID}>
      {children}
    </div>
  );
}
