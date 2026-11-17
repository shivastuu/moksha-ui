import type { ReactNode } from 'react';

export interface AppBarProps {
  title: string;
  /** A small line under the title, like "Savings •• 4821" */
  subtitle?: string;
  /** Shows a back button */
  onBack?: () => void;
  /** @default 'Back' */
  backLabel?: string;
  /** Up to two IconButtons, on the right */
  actions?: ReactNode;
  /** Web: the title's heading level @default 1 */
  headingLevel?: 1 | 2 | 3;
  testID?: string;
}
