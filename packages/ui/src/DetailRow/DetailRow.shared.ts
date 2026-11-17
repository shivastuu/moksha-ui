import type { ReactNode } from 'react';

export interface DetailRowProps {
  /** What the value is, like "Transaction ID" */
  label: string;
  /** Text, or any element like a Tag */
  value: ReactNode;
  testID?: string;
}
