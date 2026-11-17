export interface PinPadProps {
  /** What the PIN is for, like "Enter UPI PIN" */
  label: string;
  /** Number of digits @default 4 */
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called once, when the last digit is entered */
  onComplete?: (pin: string) => void;
  /** Shakes the dots and shows the message, like "Incorrect PIN. 2 attempts left" */
  error?: string;
  testID?: string;
}

export type PinKey = (typeof pinKeys)[number];

/** The keypad, row by row. The empty slot keeps 0 under 8, as on a phone */
export const pinKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'] as const;

/** Key size and gaps, in px */
export const pinPad = { key: 72, rowGap: 16, columnGap: 24, dot: 14 };

export const nextPin = (pin: string, key: PinKey, length: number) =>
  key === 'delete' ? pin.slice(0, -1) : key === '' || pin.length >= length ? pin : pin + key;

/** Spoken after each press. Says how many digits, never which */
export const pinStatus = (count: number, length: number) => `${count} of ${length} digits entered`;
