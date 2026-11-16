import { describe, expect, it } from 'vitest';
import {
  digitsOnly,
  formatAccountNumber,
  formatAmount,
  formatPhone,
  groupDigits,
  isValidAccountNumber,
  isValidIndianMobile,
  maskAccountNumber,
  parseAmount,
} from './format';

describe('format helpers', () => {
  it('keeps digits only', () => {
    expect(digitsOnly('+91 98765-43210')).toBe('919876543210');
  });

  it('groups digits and keeps the remainder', () => {
    expect(groupDigits('1234567', [3, 2])).toBe('123 45 67');
    expect(groupDigits('12', [3, 2])).toBe('12');
  });

  it('formats Indian mobile numbers while typing', () => {
    expect(formatPhone('98765')).toBe('98765');
    expect(formatPhone('9876543210')).toBe('98765 43210');
  });

  it('validates Indian mobile numbers', () => {
    expect(isValidIndianMobile('9876543210')).toBe(true);
    expect(isValidIndianMobile('5876543210')).toBe(false);
    expect(isValidIndianMobile('98765')).toBe(false);
  });

  it.each([
    ['₹ 0012,34.567', '1234.56'],
    ['.5', '0.5'],
    ['1.2.3', '1.23'],
    ['000', '0'],
    ['abc', ''],
    ['10.', '10.'],
  ])('parses the amount %s as %s', (text, expected) => {
    expect(parseAmount(text)).toBe(expected);
  });

  it('parses whole amounts when no decimals are allowed', () => {
    expect(parseAmount('1234.56', 0)).toBe('1234');
  });

  it.each([
    ['', ''],
    ['5', '5'],
    ['1234', '1,234'],
    ['123456', '1,23,456'],
    ['1234567.5', '12,34,567.5'],
    ['100000000', '10,00,00,000'],
    ['12.', '12.'],
  ])('formats %s with Indian grouping as %s', (value, expected) => {
    expect(formatAmount(value)).toBe(expected);
  });

  it('formats and masks account numbers', () => {
    expect(formatAccountNumber('123456789012')).toBe('1234 5678 9012');
    expect(maskAccountNumber('123456789012')).toBe('•••• •••• 9012');
    expect(maskAccountNumber('1234')).toBe('1234');
  });

  it('validates Indian account number length', () => {
    expect(isValidAccountNumber('12345678')).toBe(false);
    expect(isValidAccountNumber('123456789')).toBe(true);
    expect(isValidAccountNumber('1'.repeat(19))).toBe(false);
  });
});
