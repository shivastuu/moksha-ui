'use client';

import type { ReactNode } from 'react';
import type { BannerProps, BannerTone } from './Banner.shared';

const glyphs: Record<BannerTone, ReactNode> = {
  info: <path d="M12 11v5M12 7.5h.01" />,
  success: <path d="M6.5 12.5l3.5 3.5 7.5-8" />,
  warning: <path d="M12 7v6M12 16.5h.01" />,
  danger: <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" />,
};

const Glyph = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

/** A message that stays on the page until it is dealt with, like a pending KYC or a failed payment */
export function Banner({ tone = 'info', title, children, action, onDismiss, testID }: BannerProps) {
  return (
    <div className={`ds-banner ds-banner--${tone}`} role={tone === 'danger' ? 'alert' : 'status'} data-testid={testID}>
      <span className="ds-banner__icon">
        <Glyph>{glyphs[tone]}</Glyph>
      </span>
      <div className="ds-banner__main">
        <div className="ds-banner__body">
          {title && <p className="ds-banner__title">{title}</p>}
          <div className="ds-banner__text">{children}</div>
        </div>
        {action && (
          <button type="button" className="ds-banner__action ds-press ds-press--object" onClick={action.onPress}>
            {action.label}
          </button>
        )}
      </div>
      {onDismiss && (
        <button type="button" className="ds-banner__dismiss ds-press ds-press--object" aria-label="Dismiss" onClick={onDismiss}>
          <Glyph>
            <path d="M7 7l10 10M17 7L7 17" />
          </Glyph>
        </button>
      )}
    </div>
  );
}
