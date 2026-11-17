export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Shown until something is chosen, like "Choose a bank" */
  placeholder?: string;
  helperText?: string;
  /** Shown instead of the helper text, in red, and shakes the field */
  error?: string;
  disabled?: boolean;
  required?: boolean;
  /** Web: the form field name */
  name?: string;
  testID?: string;
}
