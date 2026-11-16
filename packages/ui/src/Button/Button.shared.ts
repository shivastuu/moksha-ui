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

export const buttonMetrics: Record<ButtonSize, { height: number; paddingX: number; fontSize: number }> = {
  sm: { height: 36, paddingX: 12, fontSize: 14 },
  md: { height: 44, paddingX: 16, fontSize: 16 },
  lg: { height: 52, paddingX: 20, fontSize: 18 },
};
