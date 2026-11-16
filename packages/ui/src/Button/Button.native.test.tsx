import { fireEvent, render, screen } from '@testing-library/react-native';
import { colors } from '@shivastu/tokens';
import { Button, ThemeProvider } from '../index';

describe('Button (native)', () => {
  it('renders a pressable with the button role and its label', async () => {
    await render(<Button>Pay now</Button>);
    expect(screen.getByRole('button', { name: 'Pay now' })).toBeTruthy();
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    await render(<Button onPress={onPress}>Pay now</Button>);
    await fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['disabled', { disabled: true }],
    ['loading', { loading: true }],
  ])('blocks presses when %s', async (_, props) => {
    const onPress = jest.fn();
    await render(
      <Button onPress={onPress} {...props}>
        Pay now
      </Button>
    );
    await fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole('button').props.accessibilityState).toMatchObject({ disabled: true });
  });

  it('marks a loading button busy and shows a spinner', async () => {
    await render(
      <Button loading testID="pay">
        Pay now
      </Button>
    );
    expect(screen.getByRole('button').props.accessibilityState).toMatchObject({ busy: true });
    expect(screen.getByTestId('pay-spinner')).toBeTruthy();
    expect(screen.getByTestId('pay')).not.toHaveStyle({ opacity: 0.5 });
  });

  it('uses the colors of the color scheme from ThemeProvider', async () => {
    await render(
      <ThemeProvider colorScheme="dark">
        <Button testID="pay">Pay now</Button>
      </ThemeProvider>
    );
    expect(screen.getByTestId('pay')).toHaveStyle({ backgroundColor: colors.dark.primary });
    expect(screen.getByText('Pay now')).toHaveStyle({ color: colors.dark.onPrimary });
  });

  it('uses the app fonts when ThemeProvider receives them', async () => {
    const fonts = { regular: 'Inter_400Regular', medium: 'Inter_500Medium', semibold: 'Inter_600SemiBold' };
    await render(
      <ThemeProvider fonts={fonts}>
        <Button>Pay now</Button>
      </ThemeProvider>
    );
    expect(screen.getByText('Pay now')).toHaveStyle({ fontFamily: 'Inter_600SemiBold' });
  });
});
