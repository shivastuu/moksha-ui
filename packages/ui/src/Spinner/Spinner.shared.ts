export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  /** sm 16, md 24, lg 36 px @default 'md' */
  size?: SpinnerSize;
  /** `primary`, or `current` to take the surrounding text color @default 'primary' */
  tone?: 'primary' | 'current';
  /** What is loading, for screen readers @default 'Loading' */
  label?: string;
  testID?: string;
}

export const spinnerSizes: Record<SpinnerSize, number> = { sm: 16, md: 24, lg: 36 };
