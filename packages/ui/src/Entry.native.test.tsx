import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, Animated } from 'react-native';
import { foundations } from '@moksha-ui/tokens';
import { NumberStepper, PinPad, SuccessCheck, TextArea } from './index';

const settle = () => act(async () => {});

afterEach(() => jest.restoreAllMocks());

describe('entry (native)', () => {
  it('SuccessCheck springs in with the bouncy spring, and shows the final mark at once with reduced motion', async () => {
    const spring = jest.spyOn(Animated, 'spring');
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    const { unmount } = await render(<SuccessCheck accessibilityLabel="Payment successful" />);
    await settle();
    expect(screen.getByRole('image', { name: 'Payment successful' })).toBeTruthy();
    expect(spring).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ toValue: 1, ...foundations.motion.spring.bouncy }));
    await unmount();
    spring.mockClear();
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    await render(<SuccessCheck />);
    await settle();
    expect(spring).not.toHaveBeenCalled();
  });

  it('PinPad announces the count after each key, never the digits, and completes once', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    const onComplete = jest.fn();
    await render(<PinPad label="Enter UPI PIN" onComplete={onComplete} />);
    for (const digit of ['4', '8', '2', '1']) {
      await fireEvent.press(screen.getByRole('button', { name: digit }));
    }
    expect(announce.mock.calls.map(([text]) => text)).toEqual(['1 of 4 digits entered', '2 of 4 digits entered', '3 of 4 digits entered', '4 of 4 digits entered']);
    expect(onComplete).toHaveBeenCalledWith('4821');
    expect(screen.getByLabelText('4 of 4 digits entered')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.getByLabelText('3 of 4 digits entered')).toBeTruthy();
  });

  it('NumberStepper is adjustable: increment and decrement actions step within the limits', async () => {
    const onValueChange = jest.fn();
    await render(<NumberStepper label="Months" defaultValue={6} min={3} max={12} step={3} format={(n) => `${n} months`} onValueChange={onValueChange} />);
    const value = screen.getByRole('adjustable', { name: 'Months' });
    expect(value.props.accessibilityValue).toEqual({ min: 3, max: 12, now: 6, text: '6 months' });
    await fireEvent(value, 'accessibilityAction', { nativeEvent: { actionName: 'increment' } });
    expect(onValueChange).toHaveBeenLastCalledWith(9);
    await fireEvent.press(screen.getByRole('button', { name: 'Decrease Months' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Decrease Months' }));
    expect(onValueChange).toHaveBeenLastCalledWith(3);
    expect(screen.getByRole('button', { name: 'Decrease Months' }).props.accessibilityState).toMatchObject({ disabled: true });
  });

  it('TextArea is multiline, capped, and reads its count with the hint', async () => {
    await render(<TextArea label="Note for payee" helperText="They see this" maxLength={20} />);
    const input = screen.getByLabelText('Note for payee');
    expect([input.props.multiline, input.props.maxLength]).toEqual([true, 20]);
    await fireEvent.changeText(input, 'Rent for November');
    expect(screen.getByLabelText('Note for payee').props.accessibilityHint).toBe('They see this. 17 of 20 characters');
    expect(screen.getByText('17/20', { includeHiddenElements: true })).toBeTruthy();
  });
});
