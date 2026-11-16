import { alpha, hexToOklch, mix, oklchToHex, type SemanticColors } from '@moksha-ui/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /** Button label */
  children: string;
  /** Called when the button is pressed (tap on native, click or keyboard on web) */
  onPress?: () => void;
  /** Visual style @default 'primary' */
  variant?: ButtonVariant;
  /** Height, padding and font size @default 'md' */
  size?: ButtonSize;
  /** Disables the button */
  disabled?: boolean;
  /** Shows a spinner, marks the button busy and blocks presses */
  loading?: boolean;
  /** Stretches the button to the width of its container */
  fullWidth?: boolean;
  /** Accessible name, defaults to the label */
  accessibilityLabel?: string;
  /** Id for tests: `data-testid` on web, `testID` on native. The loading spinner gets `${testID}-spinner` */
  testID?: string;
}

/** The same hue, lighter. Works in both schemes, where mixing with white would not */
const lighten = (hex: string, amount: number) => {
  const color = hexToOklch(hex);
  return oklchToHex({ ...color, l: Math.min(1, color.l + amount) });
};

/** Depth for buttons: a primary lit from the top with a glow in the brand color, and a soft tinted secondary */
export function buttonDepth({ primary, primaryPressed, primarySubtle }: SemanticColors) {
  return {
    primaryFill: `linear-gradient(180deg, ${lighten(primary, 0.06)}, ${primary})`,
    primaryShadow: `inset 0 1px 0 ${alpha(lighten(primary, 0.3), 0.6)}, 0 1px 2px ${alpha(primaryPressed, 0.35)}, 0 8px 20px -8px ${alpha(primary, 0.6)}`,
    secondaryHover: mix(primary, primarySubtle, 0.1),
  };
}
