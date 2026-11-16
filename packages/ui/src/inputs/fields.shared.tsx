'use client';

import { useState, type ComponentType } from 'react';
import type { TextFieldProps } from '../TextField/TextField.shared';
import {
  digitsOnly,
  formatAccountNumber,
  formatAmount,
  formatPhone,
  maskAccountNumber,
  parseAmount,
} from './format';

type Preset<Fixed extends keyof TextFieldProps> = Omit<TextFieldProps, Fixed>;

export interface PhoneFieldProps extends Preset<'format' | 'parse' | 'inputMode' | 'prefix' | 'maxLength'> {
  /** Country code shown before the number @default '+91' */
  countryCode?: string;
}

export function createPhoneField(TextField: ComponentType<TextFieldProps>) {
  return function PhoneField({ countryCode = '+91', ...props }: PhoneFieldProps) {
    return (
      <TextField
        inputMode="tel"
        autoComplete="tel-national"
        maxLength={10}
        prefix={countryCode}
        format={formatPhone}
        parse={digitsOnly}
        {...props}
      />
    );
  };
}

export interface AmountFieldProps extends Preset<'format' | 'parse' | 'inputMode' | 'prefix'> {
  /** Currency symbol shown before the amount @default '₹' */
  currency?: string;
  /** Decimal places allowed @default 2 */
  decimals?: number;
}

export function createAmountField(TextField: ComponentType<TextFieldProps>) {
  return function AmountField({ currency = '₹', decimals = 2, ...props }: AmountFieldProps) {
    return (
      <TextField
        inputMode={decimals > 0 ? 'decimal' : 'numeric'}
        prefix={currency}
        format={formatAmount}
        parse={(text) => parseAmount(text, decimals)}
        {...props}
      />
    );
  };
}

export interface AccountNumberFieldProps extends Preset<'format' | 'parse' | 'inputMode' | 'maxLength'> {
  /** Shows only the last four digits while the field is not focused @default true */
  maskWhenBlurred?: boolean;
}

export function createAccountNumberField(TextField: ComponentType<TextFieldProps>) {
  return function AccountNumberField({ maskWhenBlurred = true, onFocus, onBlur, ...props }: AccountNumberFieldProps) {
    const [focused, setFocused] = useState(false);
    return (
      <TextField
        inputMode="numeric"
        autoComplete="off"
        maxLength={18}
        parse={digitsOnly}
        format={focused || !maskWhenBlurred ? formatAccountNumber : maskAccountNumber}
        onFocus={() => {
          setFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        {...props}
      />
    );
  };
}

export type SearchFieldProps = Preset<'inputMode' | 'prefix'>;

export function createSearchField(TextField: ComponentType<TextFieldProps>, SearchIcon: ComponentType) {
  return function SearchField({ hideLabel = true, clearable = true, ...props }: SearchFieldProps) {
    return (
      <TextField inputMode="search" prefix={<SearchIcon />} hideLabel={hideLabel} clearable={clearable} {...props} />
    );
  };
}
