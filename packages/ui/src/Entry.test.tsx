import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NumberStepper, PinPad, SuccessCheck, TextArea } from './index';
import { nextPin } from './PinPad/PinPad.shared';

afterEach(cleanup);

describe('SuccessCheck (web)', () => {
  it('is one named image whose check draws from start to end', () => {
    const { container } = render(<SuccessCheck size={96} accessibilityLabel="Payment successful" />);
    const image = screen.getByRole('img', { name: 'Payment successful' });
    expect(image.style.getPropertyValue('--ds-success-size')).toBe('96px');
    expect(container.querySelector('path')?.getAttribute('pathLength')).toBe('1');
  });
});

describe('PinPad (web)', () => {
  it('adds, caps and deletes digits', () => {
    expect([nextPin('12', '3', 4), nextPin('1234', '5', 4), nextPin('12', 'delete', 4), nextPin('', 'delete', 4), nextPin('1', '', 4)]).toEqual(['123', '1234', '1', '', '1']);
  });

  it('fills dots from the keypad, says how many digits but never which, and completes once', () => {
    const onComplete = vi.fn();
    const { container } = render(<PinPad label="Enter UPI PIN" length={4} onComplete={onComplete} />);
    expect(screen.getByRole('group', { name: 'Enter UPI PIN' })).toBeTruthy();
    for (const digit of ['4', '8', '2']) {
      fireEvent.click(screen.getByRole('button', { name: digit }));
    }
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('3 of 4 digits entered');
    expect(container.querySelectorAll('.ds-pin__dot[data-filled]')).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '9' }));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith('4821');
    expect(container.textContent).not.toContain('4821');
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(status.textContent).toBe('3 of 4 digits entered');
  });

  it('takes digits and Backspace from a keyboard, and reads the error instead of the count', () => {
    const { container, rerender } = render(<PinPad label="Enter UPI PIN" />);
    const key = screen.getByRole('button', { name: '5' });
    fireEvent.keyDown(key, { key: '7' });
    fireEvent.keyDown(key, { key: '3' });
    fireEvent.keyDown(key, { key: 'Backspace' });
    expect(container.querySelectorAll('.ds-pin__dot[data-filled]')).toHaveLength(1);
    rerender(<PinPad label="Enter UPI PIN" error="Incorrect PIN. 2 attempts left" />);
    expect(screen.getByRole('status').textContent).toBe('Incorrect PIN. 2 attempts left');
    expect(container.querySelector('.ds-pin')?.classList.contains('ds-pin--invalid')).toBe(true);
  });
});

describe('NumberStepper (web)', () => {
  it('is a spinbutton: arrows step, Home and End jump, buttons stop at the limits', () => {
    const onValueChange = vi.fn();
    const { container } = render(<NumberStepper label="Travellers" defaultValue={1} min={1} max={4} format={(n) => `${n} adults`} onValueChange={onValueChange} />);
    const spin = screen.getByRole('spinbutton', { name: 'Travellers' });
    expect([spin.getAttribute('aria-valuenow'), spin.getAttribute('aria-valuetext')]).toEqual(['1', '1 adults']);
    expect(screen.getByRole('button', { name: 'Decrease Travellers' })).toHaveProperty('disabled', true);
    expect(screen.getByRole('button', { name: 'Increase Travellers' }).tabIndex).toBe(-1);
    fireEvent.keyDown(spin, { key: 'ArrowUp' });
    expect(onValueChange).toHaveBeenLastCalledWith(2);
    expect(container.querySelector('.ds-stepper__number')?.getAttribute('data-direction')).toBe('up');
    fireEvent.keyDown(spin, { key: 'End' });
    expect(spin.getAttribute('aria-valuenow')).toBe('4');
    expect(screen.getByRole('button', { name: 'Increase Travellers' })).toHaveProperty('disabled', true);
    fireEvent.click(screen.getByRole('button', { name: 'Decrease Travellers' }));
    expect([spin.getAttribute('aria-valuenow'), container.querySelector('.ds-stepper__number')?.getAttribute('data-direction')]).toEqual(['3', 'down']);
    fireEvent.keyDown(spin, { key: 'Home' });
    expect(onValueChange).toHaveBeenLastCalledWith(1);
  });
});

describe('TextArea (web)', () => {
  it('is a labelled textarea described by its hint and its count, which turns red at the limit', () => {
    const { container, rerender } = render(<TextArea label="Note for payee" helperText="They see this with the payment" maxLength={10} />);
    const box = screen.getByRole('textbox', { name: 'Note for payee' }) as HTMLTextAreaElement;
    expect(box.tagName).toBe('TEXTAREA');
    expect(box.maxLength).toBe(10);
    fireEvent.change(box, { target: { value: 'Rent, Nov' } });
    expect(screen.getByRole('textbox', { description: 'They see this with the payment 9 of 10 characters' })).toBe(box);
    expect(container.querySelector('.ds-textarea__count')?.hasAttribute('data-full')).toBe(false);
    fireEvent.change(box, { target: { value: 'Rent, Nov.' } });
    expect(container.querySelector('.ds-textarea__count')?.hasAttribute('data-full')).toBe(true);
    rerender(<TextArea label="Note for payee" error="Remove the link" maxLength={10} />);
    expect(box.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('Remove the link')).toBeTruthy();
  });
});
