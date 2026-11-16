import type { ReactNode } from 'react';
import type { SemanticColors } from '@shivastu/tokens';

export type BannerTone = 'info' | 'success' | 'warning' | 'danger';

export interface BannerProps {
  /** Colors, and how urgently screen readers announce it: `danger` interrupts, the rest wait @default 'info' */
  tone?: BannerTone;
  title?: string;
  children: ReactNode;
  /** A text button at the end, like "Update KYC" */
  action?: { label: string; onPress: () => void };
  /** Shows a close button */
  onDismiss?: () => void;
  testID?: string;
}

/** Accent and background color of each tone */
export const toneColors = (tone: BannerTone, colors: SemanticColors) =>
  ({
    info: { accent: colors.primary, background: colors.primarySubtle },
    success: { accent: colors.success, background: colors.successSubtle },
    warning: { accent: colors.warning, background: colors.warningSubtle },
    danger: { accent: colors.danger, background: colors.dangerSubtle },
  })[tone];
