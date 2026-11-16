import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, Animated, Linking } from 'react-native';
import { foundations } from '@shivastu/tokens';
import { Avatar, AvatarGroup, Link, ProgressBar, ProgressRing } from './index';

const settle = () => act(async () => {});

afterEach(() => jest.restoreAllMocks());

describe('display (native)', () => {
  it('Avatar is an image named by the person, with initials when the photo fails', async () => {
    await render(<Avatar name="Shivastu Shrivastava" src="https://example.com/me.jpg" status="busy" testID="a" />);
    expect(screen.getByLabelText('Shivastu Shrivastava, busy')).toBeTruthy();
    expect(screen.queryByText('SS')).toBeNull();
    await fireEvent(screen.getByTestId('a-photo'), 'error');
    expect(screen.getByText('SS')).toBeTruthy();
  });

  it('AvatarGroup reads out the names once and shows +N', async () => {
    await render(<AvatarGroup people={[{ name: 'Asha Rao' }, { name: 'Ravi' }, { name: 'Meera' }]} max={2} />);
    expect(screen.getByLabelText('3 people: Asha Rao, Ravi, Meera')).toBeTruthy();
    expect(screen.getByText('+1')).toBeTruthy();
  });

  it('ProgressBar springs the fill to its value and reports it', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    const spring = jest.spyOn(Animated, 'spring');
    await render(<ProgressBar value={75} label="Spend limit used" testID="p" />);
    await settle();
    expect(screen.getByTestId('p').props.accessibilityValue).toEqual({ min: 0, max: 100, now: 75 });
    expect(spring).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ toValue: -0.25, ...foundations.motion.spring.smooth }));
  });

  it('ProgressRing springs to its share of the circle', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    const spring = jest.spyOn(Animated, 'spring');
    await render(<ProgressRing value={72} label="Budget used" testID="r" />);
    await settle();
    expect(screen.getByTestId('r').props.accessibilityValue).toEqual({ min: 0, max: 100, now: 72 });
    expect(spring).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ toValue: 0.72 }));
  });

  it('Link opens its address, or calls onPress instead', async () => {
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    const onPress = jest.fn();
    const { rerender } = await render(<Link href="https://www.npci.org.in">UPI help</Link>);
    await fireEvent.press(screen.getByRole('link', { name: 'UPI help' }));
    expect(open).toHaveBeenCalledWith('https://www.npci.org.in');
    await rerender(<Link href="https://www.npci.org.in" onPress={onPress}>UPI help</Link>);
    await fireEvent.press(screen.getByRole('link', { name: 'UPI help' }));
    expect([open.mock.calls.length, onPress.mock.calls.length]).toEqual([1, 1]);
  });
});
