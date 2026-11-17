import type { ReactNode } from 'react';
import type { FloatingAlign, FloatingSide } from '../utils/floating';

/** A ref to the element a popover opens from: an HTML element on the web, a View on native */
export interface Anchor {
  current: unknown;
}

export interface PopoverProps {
  /** A ref on a wrapper around the trigger */
  anchor: Anchor;
  open: boolean;
  /** Called on Escape, a tap outside, or Android back */
  onClose: () => void;
  /** Names the panel for screen readers */
  accessibilityLabel: string;
  children: ReactNode;
  /** @default 'bottom' */
  side?: FloatingSide;
  /** @default 'start' */
  align?: FloatingAlign;
  testID?: string;
}
