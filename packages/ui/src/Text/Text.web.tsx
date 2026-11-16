'use client';

import type { CSSProperties } from 'react';
import type { TextProps } from './Text.shared';

/** Text in one of the theme's text styles, with an optional tone */
export function Text({ children, variant = 'body', tone, weight, align, numberOfLines, as: Element = 'span', testID }: TextProps) {
  const className = ['ds-text', `ds-text--${variant}`, tone && `ds-text--tone-${tone}`, numberOfLines && 'ds-text--clamp']
    .filter(Boolean)
    .join(' ');
  const style = {
    fontWeight: weight ? `var(--ds-font-weight-${weight})` : undefined,
    textAlign: align,
    WebkitLineClamp: numberOfLines,
  } as CSSProperties;
  return (
    <Element className={className} style={style} data-testid={testID}>
      {children}
    </Element>
  );
}
