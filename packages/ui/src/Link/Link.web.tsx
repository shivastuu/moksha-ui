'use client';

import type { LinkProps } from './Link.shared';

/** A link whose underline grows in on hover, with an arrow for external links */
export function Link({ children, href, onPress, external, tone = 'primary', underline = 'hover', testID }: LinkProps) {
  return (
    <a
      className={`ds-link ds-link--${tone} ds-link--underline-${underline}`}
      href={href}
      onClick={onPress}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      data-testid={testID}
    >
      {children}
      {external && (
        <>
          {/* A separate space, since a leading space inside the hidden text is dropped from the accessible name */}
          {' '}
          <svg className="ds-link__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 16 16 8M9 8h7v7" />
          </svg>
          <span className="ds-visually-hidden">(opens in a new tab)</span>
        </>
      )}
    </a>
  );
}
