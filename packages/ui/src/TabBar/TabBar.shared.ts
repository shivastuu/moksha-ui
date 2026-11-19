import type { ReactNode } from 'react';

export interface TabBarItem {
  value: string;
  label: string;
  /** Draws the icon in the given color: the active or the resting one. On the web the color is currentColor */
  icon: (color: string) => ReactNode;
  /** An unread count on the icon */
  badge?: number;
}

export interface TabBarProps {
  items: TabBarItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** @default 'Main' */
  accessibilityLabel?: string;
  testID?: string;
}

/**
 * Item sizes. One label line sits centered in the item; a label that needs a second line (narrow phones, large or
 * spaced text) grows the item downward, so the icons stay level instead of the name being cut off
 */
export const tabItem = { height: 52, icon: 24, gap: 2 };
