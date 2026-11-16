import { createContext, type ReactNode } from 'react';

export interface ListGroupProps {
  /** ListItems, or any rows */
  children: ReactNode;
  /** A small heading above the group, like "Security" */
  title?: string;
  /** A note below the group */
  footer?: string;
  testID?: string;
}

/** Native only: true for every row after the first, so it draws its divider. Web uses a CSS sibling selector */
export const ListGroupContext = createContext(false);
