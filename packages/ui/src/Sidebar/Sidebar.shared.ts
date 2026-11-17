import type { ReactNode } from 'react';

export interface SidebarItem {
  value: string;
  label: string;
  /** Draws the icon in the given color: the active or the resting one. On the web the color is currentColor */
  icon?: (color: string) => ReactNode;
  /** A count on the right, like pending requests */
  count?: number;
}

export interface SidebarSection {
  /** A small heading over the group, like "Money" */
  title?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  sections: SidebarSection[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** At the top, like a logo or account switcher */
  header?: ReactNode;
  /** At the bottom, like the signed-in user */
  footer?: ReactNode;
  /** @default 'Main' */
  accessibilityLabel?: string;
  testID?: string;
}

/** "Requests, 3 new": the count joins the name instead of running into it */
export const itemLabel = ({ label, count }: SidebarItem) => (count ? `${label}, ${count} new` : label);

/** Row height in px */
export const sidebarRow = 40;
