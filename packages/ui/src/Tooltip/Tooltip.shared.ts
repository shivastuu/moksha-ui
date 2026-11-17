import type { ReactNode } from 'react';
import type { FloatingSide } from '../utils/floating';

export interface TooltipProps {
  /**
   * A short hint, like "Copy UPI ID". Visual only: screen readers skip it, so the same words must already be the
   * control's accessible name (an IconButton's accessibilityLabel)
   */
  label: string;
  /** The control it explains */
  children: ReactNode;
  /** @default 'top' */
  side?: FloatingSide;
  testID?: string;
}

/** In ms: hover delay before showing, how long to hold on touch, and how long it stays after a long press */
export const tooltipTiming = { hover: 400, longPress: 450, touchStay: 1500 };
