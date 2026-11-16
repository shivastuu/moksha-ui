'use client';

import type { PromoBannerProps } from './PromoBanner.shared';

/** A card for offers and announcements, on the brand gradient */
export function PromoBanner({ eyebrow, title, description, action, onDismiss, art, testID }: PromoBannerProps) {
  return (
    <div className="ds-promo" data-testid={testID}>
      {eyebrow && <span className="ds-promo__eyebrow">{eyebrow}</span>}
      <p className="ds-promo__title">{title}</p>
      {description && <span className="ds-promo__text">{description}</span>}
      {action && (
        <button type="button" className="ds-promo__action" onClick={action.onPress}>
          {action.label}
        </button>
      )}
      <div className="ds-promo__art" aria-hidden="true">
        {art === undefined ? <span className="ds-promo__card" /> : art}
      </div>
      {onDismiss && (
        <button type="button" className="ds-promo__dismiss" aria-label="Dismiss" onClick={onDismiss}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M7 7l10 10M17 7L7 17" />
          </svg>
        </button>
      )}
    </div>
  );
}
