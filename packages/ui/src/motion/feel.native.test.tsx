import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, Animated } from 'react-native';
import { foundations } from '@moksha-ui/tokens';
import { Button, Chip, Skeleton } from '../index';

const settle = () => act(async () => {});

beforeEach(() => jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false));
afterEach(() => jest.restoreAllMocks());

describe('interaction feel (native)', () => {
  it('objects give on the snappy spring, the same as the web', async () => {
    const spring = jest.spyOn(Animated, 'spring');
    await render(<Chip label="Food" />);
    await settle();
    await fireEvent(screen.getByRole('button', { name: 'Food' }), 'pressIn');
    expect(spring).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ toValue: foundations.motion.scale.pressed, ...foundations.motion.spring.snappy, useNativeDriver: true }));
  });

  it('loaders breathe on the theme rhythm: half a period in, half out, on the native driver', async () => {
    const timing = jest.spyOn(Animated, 'timing');
    const loop = jest.spyOn(Animated, 'loop');
    await render(<Skeleton lines={2} />);
    await settle();
    expect(loop).toHaveBeenCalled();
    const half = foundations.motion.breathe.period / 2;
    expect(timing).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ toValue: 1, duration: half, useNativeDriver: true }));
    expect(timing).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ toValue: 0, duration: half, useNativeDriver: true }));
  });

  it('a loading primary button breathes its glow, and stops when done', async () => {
    const loop = jest.spyOn(Animated, 'loop');
    const { rerender } = await render(<Button loading>Pay</Button>);
    await settle();
    expect(loop).toHaveBeenCalled();
    loop.mockClear();
    await rerender(<Button>Pay</Button>);
    await settle();
    expect(loop).not.toHaveBeenCalled();
  });
});
