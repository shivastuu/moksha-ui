import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, Pressable, Text } from 'react-native';
import { components, themes } from 'tandemui-tokens';
import { bannerColors } from '../Banner/Banner.shared';
import { Banner, Dialog, PromoBanner, SnackbarProvider, useSnackbar } from '../index';
import { promoColors } from '../PromoBanner/PromoBanner.shared';

// React Native's own gradient parser (no type declarations); it returns one entry per gradient it understood
const processBackgroundImage: (value: string) => unknown[] =
  require('react-native/Libraries/StyleSheet/processBackgroundImage').default;

describe('Banner (native)', () => {
  it('uses the tone colors, announces danger, and wires its buttons', async () => {
    const onDismiss = jest.fn();
    await render(
      <Banner tone="danger" title="Payment failed" onDismiss={onDismiss} testID="banner">
        Your bank declined it.
      </Banner>
    );
    const banner = screen.getByTestId('banner');
    const tones = bannerColors('danger', themes.light.colors, components.banner.tint);
    expect(banner).toHaveStyle({ backgroundColor: tones.background, borderColor: tones.border });
    expect(banner.props.accessibilityRole).toBe('alert');
    await fireEvent.press(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

describe('PromoBanner (native)', () => {
  it('draws the brand gradient that React Native can parse, and wires its buttons', async () => {
    const onPress = jest.fn();
    await render(
      <PromoBanner eyebrow="Travel card" title="Pay abroad with zero forex markup" action={{ label: 'Get the card', onPress }} testID="promo" />
    );
    const { background } = promoColors(themes.light.colors);
    expect(screen.getByTestId('promo')).toHaveStyle({ backgroundImage: background });
    expect(processBackgroundImage(background)).toHaveLength(2);
    expect(screen.getByRole('header', { name: 'Pay abroad with zero forex markup' })).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Get the card' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('Dialog (native)', () => {
  it('shows the title and content only while open', async () => {
    const { rerender } = await render(
      <Dialog open={false} title="Block card?" onClose={jest.fn()}>
        You can unblock it later.
      </Dialog>
    );
    expect(screen.queryByText('Block card?')).toBeNull();
    await rerender(
      <Dialog open title="Block card?" onClose={jest.fn()} testID="panel">
        You can unblock it later.
      </Dialog>
    );
    expect(screen.getByRole('header', { name: 'Block card?' })).toBeTruthy();
    expect(screen.getByText('You can unblock it later.')).toBeTruthy();
    expect(screen.getByTestId('panel')).toHaveStyle({ maxWidth: components.modal.dialogMaxWidth });
  });

  it('closes on a tap outside only when dismissible', async () => {
    const onClose = jest.fn();
    const { rerender } = await render(<Dialog open title="Block card?" onClose={onClose} dismissible={false} />);
    await fireEvent.press(screen.getByLabelText('Close'));
    expect(onClose).not.toHaveBeenCalled();
    await rerender(<Dialog open title="Block card?" onClose={onClose} />);
    await fireEvent.press(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('becomes a bottom sheet with a handle', async () => {
    await render(<Dialog open presentation="sheet" title="Choose account" onClose={jest.fn()} testID="panel" />);
    expect(screen.getByTestId('panel')).toHaveStyle({
      maxWidth: components.modal.sheetMaxWidth,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    });
  });
});

describe('Snackbar (native)', () => {
  function Trigger() {
    const snackbar = useSnackbar();
    return (
      <Pressable accessibilityRole="button" onPress={() => snackbar.show('Copied UPI ID')}>
        <Text>Copy</Text>
      </Pressable>
    );
  }

  it('shows, announces and hides after the theme duration', async () => {
    jest.useFakeTimers();
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    await render(
      <SnackbarProvider>
        <Trigger />
      </SnackbarProvider>
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Copy' }));
    expect(screen.getByText('Copied UPI ID')).toBeTruthy();
    expect(announce).toHaveBeenCalledWith('Copied UPI ID');

    await act(async () => jest.advanceTimersByTime(components.snackbar.duration));
    expect(screen.queryByText('Copied UPI ID')).toBeNull();
    jest.useRealTimers();
  });
});
