'use client';

import type { BannerProps } from './Banner.shared';

/** A message that stays on the page until it is dealt with, like a pending KYC or a failed payment */
export function Banner({ tone = 'info', title, children, action, onDismiss, testID }: BannerProps) {
  return (
    <div className={`ds-banner ds-banner--${tone}`} role={tone === 'danger' ? 'alert' : 'status'} data-testid={testID}>
      <div className="ds-banner__body">
        {title && <p className="ds-banner__title">{title}</p>}
        <div>{children}</div>
        {action && (
          <button type="button" className="ds-banner__action" onClick={action.onPress}>
            {action.label}
          </button>
        )}
      </div>
      {onDismiss && (
        <button type="button" className="ds-banner__dismiss" aria-label="Dismiss" onClick={onDismiss}>
          ×
        </button>
      )}
    </div>
  );
}
