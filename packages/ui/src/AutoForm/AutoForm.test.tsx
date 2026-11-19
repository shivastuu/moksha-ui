import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AutoForm, defineFields, validateForm } from '../index';

afterEach(cleanup);

const payee = defineFields([
  { name: 'name', type: 'text', label: 'Payee name', required: true },
  { name: 'mobile', type: 'phone', label: 'Mobile number', required: true },
  { name: 'account', type: 'account', label: 'Account number', required: true },
  { name: 'confirm', type: 'account', label: 'Confirm account number', required: true, matches: 'account' },
  { name: 'amount', type: 'amount', label: 'Amount', required: true, min: 1, max: 100000 },
]);

const field = (name: string) => screen.getByRole('textbox', { name });
const type = (name: string, value: string) => fireEvent.change(field(name), { target: { value } });

function fillValid() {
  type('Payee name', 'Shivastu Shrivastava');
  type('Mobile number', '98765 43210');
  type('Account number', '123456789012');
  type('Confirm account number', '123456789012');
  type('Amount', '2500.5');
}

describe('validateForm', () => {
  it('runs required, the type check, matches, then validate', () => {
    const fields = defineFields([
      { name: 'a', type: 'text', label: 'Name', required: true },
      { name: 'b', type: 'text', label: 'Nickname' },
      { name: 'c', type: 'email', label: 'Email' },
      { name: 'd', type: 'phone', label: 'Mobile' },
      { name: 'e', type: 'phone', label: 'UAE mobile', countryCode: '+971' },
      { name: 'f', type: 'amount', label: 'Amount', min: 100, max: 5000000 },
      { name: 'g', type: 'amount', label: 'Top-up', max: 5000000 },
      { name: 'h', type: 'account', label: 'Account' },
      { name: 'i', type: 'account', label: 'Confirm', matches: 'h' },
      { name: 'j', type: 'otp', label: 'OTP', length: 4 },
      { name: 'k', type: 'text', label: 'PAN', validate: (value) => (/^[A-Z]{5}\d{4}[A-Z]$/.test(value) ? undefined : 'Enter a valid PAN') },
    ]);
    const values = { a: '', b: '', c: 'shivastu@', d: '12345', e: '501234', f: '99.5', g: '5000000.01', h: '12345678', i: '87654321', j: '123', k: 'abcde1234f' };
    expect(validateForm(fields, values)).toEqual({
      a: 'Name is required',
      c: 'Enter a valid email address',
      d: 'Enter a valid 10-digit mobile number',
      f: 'Minimum amount is ₹ 100',
      g: 'Maximum amount is ₹ 50,00,000',
      h: 'Enter a valid account number',
      i: 'Enter a valid account number',
      j: 'Enter the 4-digit code',
      k: 'Enter a valid PAN',
    });
    expect(validateForm(fields, { ...values, h: '123456789', i: '123456780' }).i).toBe('Must match Account');
    expect(validateForm(fields, { a: 'Shivastu', c: 'shivastu@example.com', d: '9876543210', f: '100', h: '123456789', i: '123456789', j: '1234', k: 'ABCDE1234F' })).toEqual({});
  });
});

describe('AutoForm (web)', () => {
  it('builds the right field for each type, in order', () => {
    render(<AutoForm fields={payee} onSubmit={vi.fn()} submitLabel="Add payee" />);
    expect(field('Mobile number').getAttribute('inputmode')).toBe('tel');
    expect(screen.getByText('+91')).toBeTruthy();
    expect(screen.getByText('₹')).toBeTruthy();
    expect(screen.getAllByRole('textbox')).toEqual(
      ['Payee name', 'Mobile number', 'Account number', 'Confirm account number', 'Amount'].map(field)
    );
    expect(screen.getByRole('button', { name: 'Add payee' })).toBeTruthy();
    // The keyboard's return key says Next until the last field, which says Go
    expect(screen.getAllByRole('textbox').map((input) => input.getAttribute('enterkeyhint'))).toEqual(['next', 'next', 'next', 'next', 'go']);
  });

  it('shows an error after blur, not while typing the first time, and clears it once fixed', () => {
    render(<AutoForm fields={payee} onSubmit={vi.fn()} />);
    const mobile = field('Mobile number');
    type('Mobile number', '12345');
    expect(screen.queryByText('Enter a valid 10-digit mobile number')).toBeNull();

    fireEvent.blur(mobile);
    expect(screen.getByText('Enter a valid 10-digit mobile number')).toBeTruthy();
    expect(mobile.getAttribute('aria-invalid')).toBe('true');

    type('Mobile number', '98765 43210');
    expect(screen.queryByText('Enter a valid 10-digit mobile number')).toBeNull();
  });

  it('on submit with errors, shows them all and focuses the first one without calling onSubmit', () => {
    const onSubmit = vi.fn();
    render(<AutoForm fields={payee} onSubmit={onSubmit} />);
    type('Payee name', 'Shivastu Shrivastava');
    type('Account number', '123456789012');
    type('Confirm account number', '123456789000');
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Mobile number is required')).toBeTruthy();
    expect(screen.getByText('Must match Account number')).toBeTruthy();
    expect(screen.getByText('Amount is required')).toBeTruthy();
    expect(document.activeElement).toBe(field('Mobile number'));
  });

  it('submits raw values once, with a spinner while it runs', async () => {
    let finish!: () => void;
    const onSubmit = vi.fn(() => new Promise<void>((resolve) => (finish = resolve)));
    render(<AutoForm fields={payee} onSubmit={onSubmit} testID="payee" />);
    fillValid();
    const button = screen.getByTestId('payee-submit');
    fireEvent.click(button);
    // The fields stay editable while submitting, so Enter on the last one must not submit again
    fireEvent.keyDown(field('Amount'), { key: 'Enter' });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Shivastu Shrivastava',
      mobile: '9876543210',
      account: '123456789012',
      confirm: '123456789012',
      amount: '2500.5',
    });
    expect(button.getAttribute('aria-busy')).toBe('true');

    await act(async () => finish());
    expect(button.getAttribute('aria-busy')).toBeNull();
  });

  it('shows errors the server returns on their fields, until the field changes', async () => {
    render(<AutoForm fields={payee} onSubmit={async () => ({ account: 'No account with this number' })} />);
    fillValid();
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Submit' })));

    expect(screen.getByText('No account with this number')).toBeTruthy();
    expect(document.activeElement).toBe(field('Account number'));
    type('Account number', '123456789013');
    expect(screen.queryByText('No account with this number')).toBeNull();
    expect(screen.getByText('Must match Account number')).toBeTruthy();
  });

  it('moves to the next field on Enter and submits from the last one', () => {
    const onSubmit = vi.fn();
    render(<AutoForm fields={payee} onSubmit={onSubmit} />);
    fillValid();
    fireEvent.keyDown(field('Payee name'), { key: 'Enter' });
    expect(document.activeElement).toBe(field('Mobile number'));
    fireEvent.keyDown(field('Amount'), { key: 'Enter' });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('types the submitted values from the field names', () => {
    render(
      <AutoForm
        fields={payee}
        onSubmit={(values) => {
          values.mobile.trim();
          // @ts-expect-error not a field
          values.email;
        }}
      />
    );
  });
});
