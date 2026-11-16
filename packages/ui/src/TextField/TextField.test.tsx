import { act, cleanup, createEvent, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TextField, digitsOnly, groupDigits } from '../index';

afterEach(cleanup);

/** Types like a user editing in place: sets the text and the caret, then fires the input event */
function typeAt(input: HTMLInputElement, text: string, caret: number) {
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
  act(() => {
    setValue.call(input, text);
    input.setSelectionRange(caret, caret);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

describe('TextField (web)', () => {
  it('labels the input and keeps its own value when uncontrolled', () => {
    const onChangeText = vi.fn();
    render(<TextField label="Full name" onChangeText={onChangeText} />);
    const input = screen.getByLabelText('Full name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Asha' } });
    expect(input.value).toBe('Asha');
    expect(onChangeText).toHaveBeenLastCalledWith('Asha');
  });

  it('links helper text, and switches to the error state with the error message', () => {
    const { rerender } = render(<TextField label="PAN" helperText="10 characters" />);
    const input = screen.getByLabelText('PAN');
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(document.getElementById(input.getAttribute('aria-describedby')!)?.textContent).toBe('10 characters');

    rerender(<TextField label="PAN" helperText="10 characters" error="Enter a valid PAN" />);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(document.getElementById(input.getAttribute('aria-describedby')!)?.textContent).toBe('Enter a valid PAN');
    expect(screen.queryByText('10 characters')).toBeNull();
  });

  it('shows the formatted value and reports the raw value', () => {
    const onChangeText = vi.fn();
    render(
      <TextField
        label="Phone"
        format={(value) => groupDigits(value, [5, 5])}
        parse={digitsOnly}
        onChangeText={onChangeText}
      />
    );
    const input = screen.getByLabelText('Phone') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '98765-43210' } });
    expect(input.value).toBe('98765 43210');
    expect(onChangeText).toHaveBeenLastCalledWith('9876543210');
  });

  it('keeps the caret in place when typing in the middle of a formatted value', () => {
    render(
      <TextField label="Phone" defaultValue="98765432" format={(value) => groupDigits(value, [5, 5])} parse={digitsOnly} />
    );
    const input = screen.getByLabelText('Phone') as HTMLInputElement;
    expect(input.value).toBe('98765 432');

    typeAt(input, '981765 432', 3);
    expect(input.value).toBe('98176 5432');
    expect(input.selectionStart).toBe(3);

    typeAt(input, '981761 5432', 6);
    expect(input.value).toBe('98176 15432');
    expect(input.selectionStart).toBe(7);
  });

  it('limits the raw value to maxLength', () => {
    render(<TextField label="PIN code" maxLength={6} parse={digitsOnly} />);
    const input = screen.getByLabelText('PIN code') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '5600011' } });
    expect(input.value).toBe('560001');
  });

  it('clears the value with the clear button and focuses the input', () => {
    const onChangeText = vi.fn();
    render(<TextField label="City" defaultValue="Pune" clearable onChangeText={onChangeText} />);
    fireEvent.click(screen.getByRole('button', { name: 'Clear City' }));
    const input = screen.getByLabelText('City') as HTMLInputElement;
    expect(input.value).toBe('');
    expect(onChangeText).toHaveBeenLastCalledWith('');
    expect(document.activeElement).toBe(input);
    expect(screen.queryByRole('button', { name: 'Clear City' })).toBeNull();
  });

  it('blocks pasting when allowPaste is false', () => {
    render(<TextField label="Re-enter account number" allowPaste={false} />);
    const input = screen.getByLabelText('Re-enter account number');
    const paste = createEvent.paste(input);
    fireEvent(input, paste);
    expect(paste.defaultPrevented).toBe(true);
  });

  it('calls onSubmitEditing on Enter', () => {
    const onSubmitEditing = vi.fn();
    render(<TextField label="Search" onSubmitEditing={onSubmitEditing} />);
    fireEvent.keyDown(screen.getByLabelText('Search'), { key: 'Enter' });
    expect(onSubmitEditing).toHaveBeenCalledTimes(1);
  });

  it('sets the keyboard, input type, required and disabled states', () => {
    render(<TextField label="Email" inputMode="email" required disabled testID="email" variant="glass" />);
    const input = screen.getByTestId('email') as HTMLInputElement;
    expect(input.type).toBe('email');
    expect(input.inputMode).toBe('email');
    expect(input.required).toBe(true);
    expect(input.disabled).toBe(true);
    expect(screen.getByTestId('email-control').className).toBe('ds-field__control ds-field__control--glass');
  });

  it('masks secure entry', () => {
    render(<TextField label="Password" secureTextEntry />);
    expect((screen.getByLabelText('Password') as HTMLInputElement).type).toBe('password');
  });
});
