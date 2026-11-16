export interface CheckboxProps {
  /** Checked, or 'mixed' for a "select all" that covers some items */
  checked?: boolean | 'mixed';
  /** @default false */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Visible label. Without it, pass `accessibilityLabel` */
  label?: string;
  description?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
  /** Web only: the form field name */
  name?: string;
  testID?: string;
}
