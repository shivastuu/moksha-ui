import type { ReactNode } from 'react';

export type DialogPresentation = 'auto' | 'dialog' | 'sheet';

export interface DialogProps {
  open: boolean;
  /** Called on Escape, a tap outside or Android back, unless `dismissible` is false */
  onClose: () => void;
  /** Heading, also the dialog's accessible name */
  title: string;
  children?: ReactNode;
  /** Buttons at the bottom, usually a secondary and a primary Button */
  actions?: ReactNode;
  /** `auto` is a centered dialog that becomes a bottom sheet on screens narrower than `breakpoints.sm` @default 'auto' */
  presentation?: DialogPresentation;
  /** Lets people close it without choosing an action @default true */
  dismissible?: boolean;
  /** Id for tests, on the panel */
  testID?: string;
}

export type BottomSheetProps = Omit<DialogProps, 'presentation'>;
