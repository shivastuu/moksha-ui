'use client';

import { useRef } from 'react';
import { digitsOnly } from '../inputs/format';
import { useControllableState } from '../utils/useControllableState';

export interface OtpFieldProps {
  /** Visible label, also the accessible name */
  label: string;
  hideLabel?: boolean;
  /** Number of digits @default 6 */
  length?: number;
  value?: string;
  defaultValue?: string;
  onChangeText?: (value: string) => void;
  /** Called once when every digit is filled */
  onComplete?: (code: string) => void;
  /** Shows dots instead of digits, for PINs */
  masked?: boolean;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  /** Id for tests, set on the hidden input */
  testID?: string;
}

/** Digits-only code of a fixed length, firing `onComplete` once per completed code */
export function useOtp({
  length,
  value,
  defaultValue = '',
  onChangeText,
  onComplete,
}: Pick<OtpFieldProps, 'value' | 'defaultValue' | 'onChangeText' | 'onComplete'> & { length: number }) {
  const [code, setCode] = useControllableState(value, defaultValue, onChangeText);
  const completed = useRef<string | null>(null);

  const change = (text: string) => {
    const next = digitsOnly(text).slice(0, length);
    setCode(next);
    if (next.length < length) {
      completed.current = null;
    } else if (completed.current !== next) {
      completed.current = next;
      onComplete?.(next);
    }
  };

  return {
    code,
    change,
    cells: Array.from({ length }, (_, index) => code[index] ?? ''),
    activeIndex: Math.min(code.length, length - 1),
  };
}
