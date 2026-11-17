import type { ReactNode } from 'react';

export interface ListItemProps {
  title: string;
  description?: string;
  /** An avatar, icon or logo before the text */
  leading?: ReactNode;
  /** A value like "English" (shown muted), or a control like a Switch. Don't put a control in a row that has `onPress` */
  trailing?: ReactNode;
  /** Makes the whole row a button with a chevron */
  onPress?: () => void;
  disabled?: boolean;
  /** Replaces the spoken name (title and value) with one sentence, like "Paid ₹486.00 to Swiggy" */
  accessibilityLabel?: string;
  testID?: string;
}

/** Text values in the trailing slot. Native needs them wrapped in Text, and they join the row's name */
export const isTextValue = (node: ReactNode): node is string | number => typeof node === 'string' || typeof node === 'number';
