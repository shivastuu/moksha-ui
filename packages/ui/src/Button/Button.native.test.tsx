import { Text } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { foundations, themes } from '@moksha-ui/tokens';
import { Button, ThemeProvider, useTheme } from '../index';

function ThemeProbe() {
  const theme = useTheme();
  return (
    <Text testID="probe">
      {[theme.scheme, theme.shadows.md, theme.space.lg, theme.typography.textStyles.body.fontSize].join('|')}
    </Text>
  );
}

describe('useTheme (native)', () => {
  it('returns the full theme for the color scheme', async () => {
    await render(
      <ThemeProvider colorScheme="dark">
        <ThemeProbe />
      </ThemeProvider>
    );
    expect(screen.getByTestId('probe')).toHaveTextContent(
      ['dark', themes.dark.shadows.md, foundations.space.lg, foundations.typography.textStyles.body.fontSize].join('|')
    );
  });
});

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
    expect(screen.getByTestId('pay')).toHaveStyle({ backgroundColor: themes.dark.colors.primary });
    expect(screen.getByText('Pay now')).toHaveStyle({ color: themes.dark.colors.textOnPrimary });
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
