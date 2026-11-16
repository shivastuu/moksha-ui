import type { ReactNode } from 'react';

export interface LinkProps {
  children: ReactNode;
  /** Where it goes. On React Native it opens with `Linking` unless `onPress` is given */
  href?: string;
  onPress?: () => void;
  /** Opens in a new tab on the web, with an arrow and "opens in a new tab" for screen readers */
  external?: boolean;
  /** @default 'primary' */
  tone?: 'primary' | 'default';
  /** @default 'hover' (always on React Native, which has no hover) */
  underline?: 'hover' | 'always';
  testID?: string;
}
