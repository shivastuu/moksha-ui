import type { ReactNode } from 'react';

export interface EmptyStateProps {
  /** What is missing, like "No transactions yet" */
  title: string;
  /** What to do about it */
  description?: string;
  /** An icon shown in a soft medallion with rings around it. Decorative: hidden from screen readers */
  icon?: ReactNode;
  /** One next step, like "Add money" */
  action?: { label: string; onPress: () => void };
  testID?: string;
}

/** Medallion and ring sizes, in px */
export const medallion = { size: 64, rings: [96, 132] };
