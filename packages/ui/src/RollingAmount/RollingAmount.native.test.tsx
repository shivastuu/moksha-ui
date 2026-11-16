import { act, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, Animated } from 'react-native';
import { foundations } from 'tandemui-tokens';
import { RollingAmount } from '../index';

const settle = () => act(async () => {});

afterEach(() => jest.restoreAllMocks());

describe('RollingAmount (native)', () => {
  it('rolls each digit up with the smooth spring, lower places first and a beat at each comma', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    const spring = jest.spyOn(Animated, 'spring');
    await render(<RollingAmount value={4821} decimals={0} testID="amount" />);
    await settle();
    expect(screen.getByLabelText('₹4,821')).toBeTruthy();
    expect(spring.mock.calls.map(([, config]) => [config.toValue, config.delay])).toEqual([
      [4, 100],
      [8, 50],
      [2, 25],
      [1, 0],
    ]);
    expect(spring.mock.calls[0]?.[1]).toMatchObject(foundations.motion.spring.smooth);
  });

  it('shows the digits at once with Reduce Motion, and rolls them to dots when hidden', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    const spring = jest.spyOn(Animated, 'spring');
    const { rerender } = await render(<RollingAmount value={4821} decimals={0} />);
    await settle();
    expect(spring).not.toHaveBeenCalled();
    await rerender(<RollingAmount value={4821} decimals={0} hidden />);
    expect(screen.getByLabelText('Balance hidden')).toBeTruthy();
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    await rerender(<RollingAmount value={4821} decimals={0} key="moving" />);
    await settle();
    spring.mockClear();
    await rerender(<RollingAmount value={4821} decimals={0} key="moving" hidden />);
    expect(spring.mock.calls.map(([, config]) => config.toValue)).toEqual([10, 10, 10, 10]);
  });
});
