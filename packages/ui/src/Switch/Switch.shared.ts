export interface SwitchProps {
  /** On or off, for a controlled switch */
  checked?: boolean;
  /** @default false */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Visible label beside the switch. Without it, pass `accessibilityLabel` */
  label?: string;
  /** A second line under the label */
  description?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
  testID?: string;
}
