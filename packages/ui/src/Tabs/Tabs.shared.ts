import type { ReactNode } from 'react';

export interface TabItem {
  value: string;
  label: string;
  /** Shown below the tabs while this tab is selected */
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** What the tabs switch between, like "Account activity" */
  accessibilityLabel: string;
  testID?: string;
}
