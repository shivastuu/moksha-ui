import type { ReactNode } from 'react';

export interface AccordionItem {
  value: string;
  title: string;
  /** Text, or any content. Shown when the section is open */
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Lets several sections stay open at once. Otherwise opening one closes the rest @default false */
  multiple?: boolean;
  /** Values of the open sections */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Web: heading level of each section title, to fit the page outline @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  testID?: string;
}

/** The open sections after pressing `value` */
export function toggle(open: string[], value: string, multiple: boolean) {
  if (open.includes(value)) {
    return open.filter((item) => item !== value);
  }
  return multiple ? [...open, value] : [value];
}
