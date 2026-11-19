import type { ReactNode } from 'react';
import type { Anchor } from '../Popover/Popover.shared';
import type { FloatingAlign, FloatingSide } from '../utils/floating';

/** Row height on web and native: a comfortable 44px touch target, growing with larger text */
export const menuRow = 44;

export interface MenuItem {
  label: string;
  onSelect: () => void;
  icon?: ReactNode;
  /** `danger` for destructive actions, like "Block card" */
  tone?: 'danger';
  disabled?: boolean;
}

export interface MenuProps {
  anchor: Anchor;
  open: boolean;
  onClose: () => void;
  /** What the menu is for, like "Card actions" */
  accessibilityLabel: string;
  items: MenuItem[];
  side?: FloatingSide;
  /** @default 'end' */
  align?: FloatingAlign;
  testID?: string;
}

/** The next enabled item from `index`, wrapping around; `step` is 1 or -1 */
export function nextEnabled(items: MenuItem[], index: number, step: 1 | -1) {
  for (let offset = 1; offset <= items.length; offset += 1) {
    const candidate = (index + step * offset + items.length * offset) % items.length;
    if (!items[candidate]!.disabled) {
      return candidate;
    }
  }
  return index;
}
