export interface RadioOption {
  value: string;
  label: string;
  /** A second line, like an account's balance */
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** The question, shown above the options and read as the group's name */
  label: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  /** Web only: the form field name. Defaults to a unique id */
  name?: string;
  testID?: string;
}
