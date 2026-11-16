import type { ReactNode, Ref } from 'react';

export type TextFieldVariant = 'outline' | 'filled' | 'glass';

export type TextFieldSize = 'md' | 'lg';

export type InputMode = 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'search' | 'url';

export type AutoComplete =
  | 'off'
  | 'one-time-code'
  | 'tel'
  | 'tel-national'
  | 'email'
  | 'name'
  | 'username'
  | 'current-password'
  | 'new-password'
  | 'postal-code';

/** What a field's `ref` gives you */
export interface FieldHandle {
  focus(): void;
}

export interface TextFieldProps {
  /** Visible label, also the accessible name of the input */
  label: string;
  /** Hides the label visually but keeps it for screen readers */
  hideLabel?: boolean;
  /** Raw value, for a controlled field */
  value?: string;
  /** Starting raw value, for an uncontrolled field */
  defaultValue?: string;
  /** Called with the raw value (after `parse`) on every change */
  onChangeText?: (value: string) => void;
  placeholder?: string;
  /** Hint shown below the input */
  helperText?: string;
  /** Error message: shows the error state and is read out with the input */
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  /** Content before the input, such as "+91", "₹" or an icon */
  prefix?: ReactNode;
  /** Content after the input */
  suffix?: ReactNode;
  /** @default 'outline' */
  variant?: TextFieldVariant;
  /** @default 'md' */
  size?: TextFieldSize;
  /** Which keyboard to show @default 'text' */
  inputMode?: InputMode;
  autoComplete?: AutoComplete;
  /** Max length of the raw value */
  maxLength?: number;
  /** Masks what is typed, for passwords and PINs */
  secureTextEntry?: boolean;
  /** Shows a clear button while there is a value */
  clearable?: boolean;
  /** Set to false to block pasting, for example in a "re-enter account number" field @default true */
  allowPaste?: boolean;
  /** Turns the raw value into what the field shows, for example adding spaces or commas */
  format?: (value: string) => string;
  /** Turns what the user typed back into the raw value, for example keeping digits only */
  parse?: (text: string) => string;
  onFocus?: () => void;
  onBlur?: () => void;
  /** Called when the user presses Enter / the keyboard's submit key */
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
  /** Id for tests, set on the input (`data-testid` on web, `testID` on native). The input box gets `${testID}-control` */
  testID?: string;
  /** `ref.current.focus()` moves focus to the input */
  ref?: Ref<FieldHandle>;
}

export const identity = (text: string) => text;

export function clampRaw(text: string, parse: (text: string) => string, maxLength?: number) {
  const raw = parse(text);
  return maxLength === undefined ? raw : raw.slice(0, maxLength);
}
