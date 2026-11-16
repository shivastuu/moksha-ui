import type { ReactNode } from 'react';

export type TagTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

export interface TagProps {
  children: string;
  /** @default 'neutral' */
  tone?: TagTone;
  /** A small dot before the label, for live statuses like "Active" */
  dot?: boolean;
  /** An icon before the label, instead of the dot */
  icon?: ReactNode;
  /** @default 'md' */
  size?: 'sm' | 'md';
  testID?: string;
}
