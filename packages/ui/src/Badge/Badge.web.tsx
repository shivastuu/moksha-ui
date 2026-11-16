'use client';

import { badgeText, type BadgeProps } from './Badge.shared';

/** A count or a dot, popping in each time it changes */
export function Badge(props: BadgeProps) {
  const { tone = 'danger', dot, label, testID } = props;
  const text = badgeText(props);
  if (text === null) {
    return null;
  }
  return (
    // A new key on each change replays the pop
    <span
      key={text}
      className={`ds-badge ds-badge--${tone}${dot ? ' ds-badge--dot' : ''}`}
      aria-label={label ?? (dot ? undefined : text)}
      aria-hidden={dot && !label ? true : undefined}
      role={label || !dot ? 'status' : undefined}
      data-testid={testID}
    >
      {text}
    </span>
  );
}
