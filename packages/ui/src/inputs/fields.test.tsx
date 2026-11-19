import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AccountNumberField, AmountField, OtpField, PhoneField, SearchField } from '../index';

afterEach(cleanup);

describe('PhoneField (web)', () => {
  it('shows the country code, formats as 5 + 5 and reports digits only', () => {
    const onChangeText = vi.fn();
    render(<PhoneField label="Mobile number" onChangeText={onChangeText} />);
    const input = screen.getByLabelText('Mobile number') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '98765abc432101' } });
    expect(input.value).toBe('98765 43210');
    expect(onChangeText).toHaveBeenLastCalledWith('9876543210');
    expect(input.type).toBe('tel');
    expect(screen.getByText('+91')).toBeTruthy();
  });

  it('accepts another country code', () => {
    render(<PhoneField label="Mobile number" countryCode="+971" />);
    expect(screen.getByText('+971')).toBeTruthy();
  });
});

describe('AmountField (web)', () => {
  it('formats with Indian grouping and two decimals', () => {
    const onChangeText = vi.fn();
    render(<AmountField label="Amount" onChangeText={onChangeText} />);
    const input = screen.getByLabelText('Amount') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '1234567.891' } });
    expect(input.value).toBe('12,34,567.89');
    expect(onChangeText).toHaveBeenLastCalledWith('1234567.89');
    expect(input.inputMode).toBe('decimal');
    expect(screen.getByText('₹')).toBeTruthy();
  });

  it('takes whole amounts only when decimals is 0', () => {
    render(<AmountField label="Amount" decimals={0} />);
    const input = screen.getByLabelText('Amount') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '1500.75' } });
    expect(input.value).toBe('1,500');
    expect(input.inputMode).toBe('numeric');
  });
});

describe('AccountNumberField (web)', () => {
  it('groups digits while focused and masks all but the last four after blur', () => {
    render(<AccountNumberField label="Account number" />);
    const input = screen.getByLabelText('Account number') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '1234 5678 9012' } });
    expect(input.value).toBe('1234 5678 9012');
    fireEvent.blur(input);
    expect(input.value).toBe('•••• •••• 9012');
    fireEvent.focus(input);
    expect(input.value).toBe('1234 5678 9012');
  });

  it('keeps the number selected when tabbed into, so typing replaces it', () => {
    render(<AccountNumberField label="Account number" defaultValue="123456789012" />);
    const input = screen.getByLabelText('Account number') as HTMLInputElement;
    // Tab selects all of the masked text before focus fires; a click leaves a caret
    input.setSelectionRange(0, input.value.length);
    fireEvent.focus(input);
    expect(input.value).toBe('1234 5678 9012');
    expect([input.selectionStart, input.selectionEnd]).toEqual([0, 14]);

    fireEvent.blur(input);
    input.setSelectionRange(3, 3);
    fireEvent.focus(input);
    expect(input.selectionStart).toBe(input.selectionEnd);
  });

  it('can stay unmasked', () => {
    render(<AccountNumberField label="Account number" maskWhenBlurred={false} defaultValue="123456789012" />);
    expect((screen.getByLabelText('Account number') as HTMLInputElement).value).toBe('1234 5678 9012');
  });
});

describe('SearchField (web)', () => {
  it('keeps the label for screen readers, shows an icon and clears', () => {
    const onChangeText = vi.fn();
    render(<SearchField label="Search transactions" placeholder="Search" onChangeText={onChangeText} />);
    const input = screen.getByLabelText('Search transactions') as HTMLInputElement;
    expect(input.type).toBe('search');
    expect(screen.getByText('Search transactions').className).toContain('ds-visually-hidden');
    fireEvent.change(input, { target: { value: 'swiggy' } });
    fireEvent.click(screen.getByRole('button', { name: 'Clear Search transactions' }));
    expect(input.value).toBe('');
    expect(onChangeText).toHaveBeenLastCalledWith('');
  });
});

describe('OtpField (web)', () => {
  it('keeps digits only, fills the cells and completes once', () => {
    const onComplete = vi.fn();
    render(<OtpField label="Enter OTP" onComplete={onComplete} testID="otp" />);
    const input = screen.getByLabelText('Enter OTP') as HTMLInputElement;
    expect(input.autocomplete).toBe('one-time-code');
    fireEvent.change(input, { target: { value: '12a3 4' } });
    expect(input.value).toBe('1234');
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: '1234567' } });
    expect(input.value).toBe('123456');
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith('123456');
    expect([...document.querySelectorAll('.ds-otp__cell')].map((cell) => cell.textContent)).toEqual([
      '1', '2', '3', '4', '5', '6',
    ]);

    fireEvent.change(input, { target: { value: '123456' } });
    expect(onComplete).toHaveBeenCalledTimes(1);

    fireEvent.change(input, { target: { value: '12345' } });
    fireEvent.change(input, { target: { value: '123459' } });
    expect(onComplete).toHaveBeenCalledTimes(2);
    expect(onComplete).toHaveBeenLastCalledWith('123459');
  });

  it('masks a PIN and shows errors', () => {
    render(<OtpField label="Enter PIN" length={4} masked error="Wrong PIN" defaultValue="12" />);
    const input = screen.getByLabelText('Enter PIN') as HTMLInputElement;
    expect(input.type).toBe('password');
    // A PIN is a secret, not a texted code: no offer to fill it from SMS
    expect(input.getAttribute('autocomplete')).toBe('off');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect([...document.querySelectorAll('.ds-otp__cell')].map((cell) => cell.textContent)).toEqual(['•', '•', '', '']);
    expect(screen.getByText('Wrong PIN')).toBeTruthy();
  });

  it('highlights the next empty cell while focused', () => {
    render(<OtpField label="Enter OTP" length={4} defaultValue="12" />);
    fireEvent.focus(screen.getByLabelText('Enter OTP'));
    const cells = document.querySelectorAll('.ds-otp__cell');
    expect(cells[2]?.className).toContain('ds-otp__cell--active');
  });
});
