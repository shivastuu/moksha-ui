import type { ReactNode } from 'react';
import { alpha, mix, type SemanticColors } from '@moksha-ui/tokens';

export interface PromoBannerProps {
  /** Small label above the title, like "Travel card" */
  eyebrow?: string;
  title: string;
  description?: string;
  /** One call to action, like "Get the card" */
  action?: { label: string; onPress: () => void };
  /** Shows a close button */
  onDismiss?: () => void;
  /** Artwork in the bottom corner. Defaults to a glass card; `null` hides it */
  art?: ReactNode;
  testID?: string;
}

/**
 * Brand gradient with a soft light in the top corner, and the glass card art. The gradient is CSS that React Native
 * also reads. Pass the light scheme's colors in both schemes: dark mode's pale primary turned the card pastel with dark
 * text, while a promo, like a bank card, should keep the deep brand color and white text
 */
export function promoColors(colors: SemanticColors) {
  const light = mix(colors.textOnPrimary, colors.primary, 0.3);
  return {
    ink: colors.textOnPrimary,
    actionInk: colors.primaryPressed,
    background: `radial-gradient(120% 140% at 100% 0%, ${light} 0%, ${alpha(light, 0)} 55%), linear-gradient(135deg, ${colors.primaryPressed}, ${colors.primary})`,
    artFill: alpha(colors.textOnPrimary, 0.16),
    artBorder: alpha(colors.textOnPrimary, 0.4),
    artDetail: alpha(colors.textOnPrimary, 0.5),
  };
}
