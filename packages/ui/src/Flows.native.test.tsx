import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, Animated } from 'react-native';
import { CopyField, ResendTimer, StepIndicator, Timeline } from './index';

const settle = () => act(async () => {});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('flows (native)', () => {
  it('ResendTimer counts down while disabled, then resends and restarts', async () => {
    jest.useFakeTimers();
    const onResend = jest.fn().mockResolvedValue(undefined);
    await render(<ResendTimer seconds={30} onResend={onResend} />);
    const button = () => screen.getByRole('button');
    expect([button().props.accessibilityLabel, button().props.accessibilityState]).toEqual(['Resend code in 0:30', { disabled: true }]);
    await act(async () => jest.advanceTimersByTime(30_000));
    expect([button().props.accessibilityLabel, button().props.accessibilityState]).toEqual(['Resend code', { disabled: false }]);
    await fireEvent.press(button());
    await settle();
    expect(onResend).toHaveBeenCalledTimes(1);
    expect(button().props.accessibilityLabel).toBe('Resend code in 0:30');
  });

  it('CopyField copies through the app and announces it; without onCopy the value is just selectable', async () => {
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    const onCopy = jest.fn().mockResolvedValue(undefined);
    const { rerender } = await render(<CopyField label="UPI ID" value="shivastu@moksha" onCopy={onCopy} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Copy UPI ID' }));
    await settle();
    expect(onCopy).toHaveBeenCalledWith('shivastu@moksha');
    expect(announce).toHaveBeenCalledWith('UPI ID copied');
    await rerender(<CopyField label="UPI ID" value="shivastu@moksha" />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('shivastu@moksha').props.selectable).toBe(true);
  });

  it('StepIndicator is one progress bar that says which step you are on', async () => {
    await render(<StepIndicator steps={['PAN', 'Aadhaar', 'Selfie', 'Done']} current={1} accessibilityLabel="KYC progress" />);
    expect(screen.getByRole('progressbar', { name: 'KYC progress' }).props.accessibilityValue).toEqual({ text: 'Step 2 of 4: Aadhaar' });
  });

  it('Timeline reads each step with its status, and pulses the current one unless motion is reduced', async () => {
    const loop = jest.spyOn(Animated, 'loop');
    const items = [
      { title: 'Payment started', time: '1:24:03 pm', status: 'complete' },
      { title: 'Sending to Swiggy', status: 'current' },
    ] as const;
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    const { unmount } = await render(<Timeline items={[...items]} />);
    await settle();
    expect(screen.getByLabelText('Done: Payment started, 1:24:03 pm')).toBeTruthy();
    expect(screen.getByLabelText('In progress: Sending to Swiggy')).toBeTruthy();
    expect(loop).toHaveBeenCalledTimes(1);
    await unmount();
    loop.mockClear();
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    await render(<Timeline items={[...items]} />);
    await settle();
    expect(loop).not.toHaveBeenCalled();
  });
});
