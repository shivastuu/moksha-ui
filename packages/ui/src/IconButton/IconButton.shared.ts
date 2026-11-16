import type { ReactNode } from 'react';

export type IconButtonVariant = 'solid' | 'soft' | 'glass' | 'ghost';

export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps {
  /** The icon, sized to half the button. On the web an `<svg>` with `stroke="currentColor"` fits best */
  icon: ReactNode;
  /** Required: an icon alone has no accessible name */
  accessibilityLabel: string;
  onPress?: () => void;
  /** @default 'soft' */
  variant?: IconButtonVariant;
  /** @default 'md' */
  size?: IconButtonSize;
  disabled?: boolean;
  /** Marks a toggle's state, like "Hide balance" being on */
  pressed?: boolean;
  testID?: string;
}
