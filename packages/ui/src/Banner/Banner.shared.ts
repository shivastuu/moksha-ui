import type { ReactNode } from 'react';
import { mix, readableTextOn, type Components, type SemanticColors } from 'tandemui-tokens';

export type BannerTone = 'info' | 'success' | 'warning' | 'danger';

export const bannerTones: BannerTone[] = ['info', 'success', 'warning', 'danger'];

export interface BannerProps {
  /** Colors and icon, and how urgently screen readers announce it: `danger` interrupts, the rest wait @default 'info' */
  tone?: BannerTone;
  title?: string;
  children: ReactNode;
  /** One button, like "Complete KYC" */
  action?: { label: string; onPress: () => void };
  /** Shows a close button */
  onDismiss?: () => void;
  testID?: string;
}

/** The tone color, a light tint of it for the background and border, and a readable color for the icon glyph */
export function bannerColors(tone: BannerTone, colors: SemanticColors, tint: Components['banner']['tint']) {
  const accent = { info: colors.primary, success: colors.success, warning: colors.warning, danger: colors.danger }[tone];
  return {
    accent,
    background: mix(accent, colors.background, tint.background),
    border: mix(accent, colors.background, tint.border),
    glyph: tone === 'info' ? colors.textOnPrimary : readableTextOn(accent),
  };
}
