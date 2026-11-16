import type { ReactNode } from 'react';
import type { SpaceToken } from '@shivastu/tokens';

export interface StackProps {
  children?: ReactNode;
  /** @default 'column' */
  direction?: 'column' | 'row';
  /** Space between children, from the spacing scale @default 'md' */
  gap?: SpaceToken;
  /** Cross-axis alignment @default 'stretch' */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Main-axis distribution @default 'start' */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  /** Lets children move to the next line */
  wrap?: boolean;
  testID?: string;
}

const edges = { start: 'flex-start', end: 'flex-end' } as const;

export const flexAlign = (value: NonNullable<StackProps['align']>) => (value === 'start' || value === 'end' ? edges[value] : value);

export const flexJustify = (value: NonNullable<StackProps['justify']>) =>
  value === 'between' ? 'space-between' : value === 'around' ? 'space-around' : value === 'start' || value === 'end' ? edges[value] : value;
