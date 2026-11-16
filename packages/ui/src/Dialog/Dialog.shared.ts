import type { ReactNode } from 'react';
import { alpha, type SemanticColors } from '@moksha-ui/tokens';

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

/** A hairline around the panel, so it keeps a crisp edge on any backdrop */
export const dialogColors = ({ text }: SemanticColors) => ({ edge: alpha(text, 0.08) });
