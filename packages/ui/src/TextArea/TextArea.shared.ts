export interface TextAreaProps {
  label: string;
  hideLabel?: boolean;
  value?: string;
  defaultValue?: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  /** Shown instead of the helper text, in red, and shakes the box */
  error?: string;
  disabled?: boolean;
  required?: boolean;
  /** Shows a counter in the corner and stops input at this length */
  maxLength?: number;
  /** Height in lines before it starts growing @default 3 */
  rows?: number;
  /** Lines it grows to before it scrolls @default 8 */
  maxRows?: number;
  testID?: string;
}

/** "42 of 200 characters", for screen readers */
export const countLabel = (count: number, max: number) => `${count} of ${max} characters`;
