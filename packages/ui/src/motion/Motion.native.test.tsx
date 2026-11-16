import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, Animated, Text } from 'react-native';
import { foundations } from '@shivastu/tokens';
import { Button, Motion, TextField } from '../index';

const { motion } = foundations;

const reduceMotion = (enabled: boolean) =>
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(enabled);

/** Lets the Reduce Motion lookup resolve */
const settle = () => act(async () => {});

// Native-driver animations run outside JS in Jest, so assert what was started, with which tokens
let timing: jest.SpyInstance;
const started = () => timing.mock.calls.map(([, config]) => config);

beforeEach(() => {
  timing = jest.spyOn(Animated, 'timing');
});
afterEach(() => jest.restoreAllMocks());

describe('Motion (native)', () => {
  it('starts from the preset and animates to rest with the token timing', async () => {
    reduceMotion(false);
    await render(
      <Motion preset="fadeUp" delay={120} testID="card">
        <Text>Hi</Text>
      </Motion>
    );
    await settle();
    expect(screen.getByTestId('card')).toHaveStyle({ opacity: 0, transform: [{ translateY: motion.distance.md }, { scale: 1 }] });
    expect(started()).toEqual([
      expect.objectContaining({ toValue: 1, duration: motion.duration.normal, delay: 120, useNativeDriver: true }),
    ]);
  });

  it('shows content right away when Reduce Motion is on', async () => {
    reduceMotion(true);
    await render(
      <Motion preset="slideUp" delay={500} testID="card">
        <Text>Hi</Text>
      </Motion>
    );
    await settle();
    expect(screen.getByTestId('card')).toHaveStyle({ opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] });
    expect(timing).not.toHaveBeenCalled();
  });
});

describe('Component motion (native)', () => {
  it('scales a button down while pressed and back on release', async () => {
    reduceMotion(false);
    await render(<Button testID="pay">Pay</Button>);
    await settle();
    await fireEvent(screen.getByTestId('pay'), 'pressIn');
    await fireEvent(screen.getByTestId('pay'), 'pressOut');
    expect(started()).toEqual([
      expect.objectContaining({ toValue: motion.scale.pressed, duration: motion.duration.fast }),
      expect.objectContaining({ toValue: 1, duration: motion.duration.fast }),
    ]);
  });

  it('shakes a field only when an error newly appears', async () => {
    reduceMotion(false);
    await render(<TextField label="PAN" error="Required" testID="pan" />);
    await settle();
    expect(timing).not.toHaveBeenCalled();

    await screen.rerender(<TextField label="PAN" testID="pan" />);
    await screen.rerender(<TextField label="PAN" error="Enter a valid PAN" testID="pan" />);
    const d = motion.distance.sm;
    expect(started().map((config) => config.toValue)).toEqual([d, -d, d / 2, -d / 2, 0]);
  });
});
