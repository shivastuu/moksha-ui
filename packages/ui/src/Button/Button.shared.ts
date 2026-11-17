import { alpha, contrastRatio, hexToOklch, mix, oklchToHex, type SemanticColors } from '@moksha-ui/tokens';

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

/** The strongest of these mixes of the brand into `base` (strongest first) that keeps brand text at AA on it */
const wash = (primary: string, base: string, weights: number[]) =>
  weights.map((weight) => mix(primary, base, weight)).find((color) => contrastRatio(primary, color) >= 4.5) ?? base;

/** Depth for buttons: a primary lit from the top with a glow in the brand color, and a soft tinted secondary */
export function buttonDepth({ primary, primaryPressed, primarySubtle, background }: SemanticColors) {
  // In dark mode the subtle brand step is a heavy navy; a light wash of the brand over the page reads calmer,
  // like iOS tinted buttons. Light mode keeps the pale brand step
  const dark = hexToOklch(background).l < 0.5;
  return {
    primaryFill: `linear-gradient(180deg, ${lighten(primary, 0.06)}, ${primary})`,
    primaryShadow: `inset 0 1px 0 ${alpha(lighten(primary, 0.3), 0.6)}, 0 1px 2px ${alpha(primaryPressed, 0.35)}, 0 8px 20px -8px ${alpha(primary, 0.6)}`,
    tint: dark ? wash(primary, background, [0.14, 0.1, 0.06]) : primarySubtle,
    // A fixed 10% hover dropped brand text below AA for most brands in light mode, so it backs off as needed
    secondaryHover: dark ? wash(primary, background, [0.22, 0.18, 0.14]) : wash(primary, primarySubtle, [0.1, 0.08, 0.06, 0.04, 0.02]),
  };
}
