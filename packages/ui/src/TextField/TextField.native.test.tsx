import { fireEvent, render, screen } from '@testing-library/react-native';
import { components, themes } from '@shivastu/tokens';
import { fieldColors } from './TextField.shared';
import {
  AccountNumberField,
  AmountField,
  OtpField,
  PhoneField,
  SearchField,
  TextField,
  ThemeProvider,
} from '../index';

describe('TextField (native)', () => {
  it('uses the label as the accessible name and keeps its own value', async () => {
    const onChangeText = jest.fn();
    await render(<TextField label="Full name" onChangeText={onChangeText} testID="name" />);
    const input = screen.getByLabelText('Full name');
    await fireEvent.changeText(input, 'Shivastu');
    expect(onChangeText).toHaveBeenLastCalledWith('Shivastu');
    expect(screen.getByTestId('name').props.value).toBe('Shivastu');
    expect(screen.getByText('Full name')).toBeTruthy();
  });

  it('shows the error in the danger color and reads it as a hint', async () => {
    await render(<TextField label="PAN" helperText="10 characters" error="Enter a valid PAN" testID="pan" />);
    expect(screen.getByText('Enter a valid PAN')).toHaveStyle({ color: themes.light.colors.danger });
    expect(screen.queryByText('10 characters')).toBeNull();
    expect(screen.getByTestId('pan').props.accessibilityHint).toBe('Enter a valid PAN');
    expect(screen.getByTestId('pan-control')).toHaveStyle({ borderColor: themes.light.colors.danger });
  });

  it('rests with a soft shadow and gets a halo on focus, without changing the border width', async () => {
    const { rerender } = await render(<TextField label="City" testID="city" />);
    const control = screen.getByTestId('city-control');
    expect(control).toHaveStyle({ borderColor: themes.light.colors.border, boxShadow: themes.light.shadows.sm });
    await fireEvent(screen.getByTestId('city'), 'focus');
    expect(control).toHaveStyle({
      borderColor: themes.light.colors.primary,
      borderWidth: 1,
      boxShadow: `0px 0px 0px ${components.field.halo}px ${fieldColors(themes.light.colors).halo}`,
    });
    await rerender(<TextField label="City" testID="city" error="Pick a city" />);
    expect(control).toHaveStyle({ boxShadow: `0px 0px 0px ${components.field.halo}px ${fieldColors(themes.light.colors).haloDanger}` });
  });

  it('clears with the clear button', async () => {
    const onChangeText = jest.fn();
    await render(<TextField label="City" defaultValue="Pune" clearable onChangeText={onChangeText} testID="city" />);
    await fireEvent.press(screen.getByRole('button', { name: 'Clear City' }));
    expect(onChangeText).toHaveBeenLastCalledWith('');
    expect(screen.getByTestId('city').props.value).toBe('');
  });

  it('passes keyboard, paste and secure entry settings to the input', async () => {
    await render(
      <TextField label="Re-enter account number" inputMode="numeric" allowPaste={false} secureTextEntry testID="acc" />
    );
    const input = screen.getByTestId('acc');
    expect(input.props.inputMode).toBe('numeric');
    expect(input.props.contextMenuHidden).toBe(true);
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('uses theme colors for the filled variant in dark mode', async () => {
    await render(
      <ThemeProvider colorScheme="dark">
        <TextField label="Note" variant="filled" testID="note" />
      </ThemeProvider>
    );
    expect(screen.getByTestId('note-control')).toHaveStyle({ backgroundColor: themes.dark.colors.surface });
  });
});

describe('fields built on TextField (native)', () => {
  it('formats a phone number and reports digits only', async () => {
    const onChangeText = jest.fn();
    await render(<PhoneField label="Mobile number" onChangeText={onChangeText} testID="phone" />);
    await fireEvent.changeText(screen.getByTestId('phone'), '98765 43210 99');
    expect(onChangeText).toHaveBeenLastCalledWith('9876543210');
    expect(screen.getByTestId('phone').props.value).toBe('98765 43210');
    expect(screen.getByText('+91')).toBeTruthy();
  });

  it('formats an amount with Indian grouping', async () => {
    await render(<AmountField label="Amount" testID="amount" />);
    await fireEvent.changeText(screen.getByTestId('amount'), '1234567.891');
    expect(screen.getByTestId('amount').props.value).toBe('12,34,567.89');
    expect(screen.getByTestId('amount').props.inputMode).toBe('decimal');
  });

  it('masks an account number after blur', async () => {
    await render(<AccountNumberField label="Account number" testID="acc" />);
    const input = screen.getByTestId('acc');
    await fireEvent(input, 'focus');
    await fireEvent.changeText(input, '123456789012');
    expect(screen.getByTestId('acc').props.value).toBe('1234 5678 9012');
    await fireEvent(screen.getByTestId('acc'), 'blur');
    expect(screen.getByTestId('acc').props.value).toBe('•••• •••• 9012');
  });

  it('gives search a hidden label, search keyboard and clear button', async () => {
    await render(<SearchField label="Search transactions" placeholder="Search" defaultValue="swiggy" testID="search" />);
    expect(screen.queryByText('Search transactions')).toBeNull();
    expect(screen.getByLabelText('Search transactions').props.returnKeyType).toBe('search');
    await fireEvent.press(screen.getByRole('button', { name: 'Clear Search transactions' }));
    expect(screen.getByTestId('search').props.value).toBe('');
  });
});

describe('OtpField (native)', () => {
  it('keeps digits only, fills the cells and completes once', async () => {
    const onComplete = jest.fn();
    await render(<OtpField label="Enter OTP" onComplete={onComplete} testID="otp" />);
    const input = screen.getByTestId('otp');
    expect(input.props.textContentType).toBe('oneTimeCode');
    await fireEvent.changeText(input, '12a345678');
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith('123456');
    expect(screen.getByTestId('otp-cell-5')).toHaveTextContent('6');
    await fireEvent.changeText(screen.getByTestId('otp'), '123456');
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('masks a PIN and highlights the next cell while focused', async () => {
    await render(<OtpField label="Enter PIN" length={4} masked defaultValue="12" testID="pin" />);
    expect(screen.getByTestId('pin-cell-0')).toHaveTextContent('•');
    expect(screen.getByTestId('pin').props.secureTextEntry).toBe(true);
    await fireEvent(screen.getByTestId('pin'), 'focus');
    expect(screen.getByTestId('pin-cell-2')).toHaveStyle({ borderColor: themes.light.colors.primary });
  });

  it('shows a caret only in the empty cell that takes the next digit', async () => {
    await render(<OtpField label="Enter OTP" length={4} defaultValue="12" testID="otp" />);
    expect(screen.queryByTestId('otp-cell-2-caret')).toBeNull();
    await fireEvent(screen.getByTestId('otp'), 'focus');
    expect(screen.getByTestId('otp-cell-2-caret')).toBeTruthy();
    expect(screen.getByTestId('otp-cell-2')).toHaveStyle({
      boxShadow: `0px 0px 0px ${components.field.halo}px ${fieldColors(themes.light.colors).halo}`,
    });
    await fireEvent.changeText(screen.getByTestId('otp'), '1234');
    expect(screen.queryByTestId('otp-cell-3-caret')).toBeNull();
  });
});
