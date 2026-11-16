'use client';

import type { ButtonProps } from './Button.shared';

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  fullWidth,
  accessibilityLabel,
  testID,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`ds-button ds-button--${variant} ds-button--${size}${fullWidth ? ' ds-button--full' : ''}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={accessibilityLabel}
      data-testid={testID}
      onClick={onPress}
    >
      {loading && (
        <span
          className="ds-spinner"
          aria-hidden="true"
          data-testid={testID ? `${testID}-spinner` : undefined}
        />
      )}
      {children}
    </button>
  );
}
