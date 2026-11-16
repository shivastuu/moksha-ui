import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, Animated } from 'react-native';
import { foundations, themes } from '@moksha-ui/tokens';
import { BankCard } from '../index';
import { bankCardColors, bankCardFinishes } from './BankCard.shared';

// React Native's own gradient parser; it returns one entry per gradient it understood
const processBackgroundImage: (value: string) => unknown[] =
  require('react-native/Libraries/StyleSheet/processBackgroundImage').default;

const card = { last4: '4821', holder: 'Shivastu Shrivastava', expiry: '08/29', testID: 'card' };
const settle = () => act(async () => {});

afterEach(() => jest.restoreAllMocks());

describe('BankCard (native)', () => {
  it('draws every finish, the chip and the light with gradients React Native understands', () => {
    const colors = bankCardColors(themes.light.colors);
    for (const finish of bankCardFinishes) {
      expect(processBackgroundImage(colors[finish].background).length).toBeGreaterThan(0);
    }
    for (const layer of [colors.chip, colors.holo, colors.glare]) {
      expect(processBackgroundImage(layer)).toHaveLength(1);
    }
  });

  it('reads as one image and shows the front, back and frozen state', async () => {
    const { rerender } = await render(<BankCard {...card} />);
    expect(screen.getByLabelText('Moksha card ending in 4821, Shivastu Shrivastava, expires 08/29')).toBeTruthy();
    expect(screen.getByText('•••• •••• •••• 4821')).toBeTruthy();
    expect(screen.queryByText('❄ Frozen')).toBeNull();
    await rerender(<BankCard {...card} frozen />);
    expect(screen.getAllByText('❄ Frozen')).toHaveLength(2);
  });

  it('flips with the smooth spring, or at once with Reduce Motion', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    const spring = jest.spyOn(Animated, 'spring');
    const { rerender } = await render(<BankCard {...card} />);
    await settle();
    spring.mockClear();
    await rerender(<BankCard {...card} flipped />);
    expect(spring).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ toValue: 1, ...foundations.motion.spring.smooth }));

    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    spring.mockClear();
    await rerender(<BankCard {...card} key="reduced" />);
    await settle();
    await rerender(<BankCard {...card} key="reduced" flipped />);
    expect(spring).not.toHaveBeenCalledWith(expect.anything(), expect.objectContaining(foundations.motion.spring.smooth));
  });

  it('tilts toward the finger and springs back when it lifts', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    const spring = jest.spyOn(Animated, 'spring');
    await render(<BankCard {...card} />);
    await settle();
    const root = screen.getByTestId('card');
    await fireEvent(root, 'layout', { nativeEvent: { layout: { width: 320, height: 202 } } });
    spring.mockClear();
    await fireEvent(root, 'responderMove', { nativeEvent: { locationX: 320, locationY: 0 } });
    const targets = () => spring.mock.calls.map(([, config]) => config.toValue);
    expect(targets()).toEqual([1, -1, 1]);
    spring.mockClear();
    await fireEvent(root, 'responderRelease');
    expect(targets()).toEqual([0, 0, 0]);
  });
});
