'use client';

import type { IconButtonProps } from './IconButton.shared';

/** A round button with only an icon. Pass `accessibilityLabel`, since an icon alone has no name */
export function IconButton({ icon, accessibilityLabel, onPress, variant = 'soft', size = 'md', disabled, pressed, testID }: IconButtonProps) {
  return (
    <button
      type="button"
      className={`ds-icon-button ds-icon-button--${variant} ds-icon-button--${size}`}
      aria-label={accessibilityLabel}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onPress}
      data-testid={testID}
    >
      {icon}
    </button>
  );
}
