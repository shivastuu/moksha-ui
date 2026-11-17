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
