import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { Receipt, SlideToConfirm, Slider, Sparkline } from './index';

const settle = () => act(async () => {});

beforeEach(() => jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true));
afterEach(() => jest.restoreAllMocks());

describe('money (native)', () => {
  it('Slider is adjustable and steps with increment and decrement', async () => {
    const onValueChange = jest.fn();
    await render(<Slider label="Monthly SIP" min={500} max={10000} step={500} defaultValue={2000} format={(n) => `₹ ${n}`} onValueChange={onValueChange} />);
    const slider = screen.getByRole('adjustable', { name: 'Monthly SIP' });
    expect(slider.props.accessibilityValue).toEqual({ min: 500, max: 10000, now: 2000, text: '₹ 2000' });
    await fireEvent(slider, 'accessibilityAction', { nativeEvent: { actionName: 'increment' } });
    expect(onValueChange).toHaveBeenLastCalledWith(2500);
  });

  it('SlideToConfirm pays on a screen reader double tap, and resets if payment fails', async () => {
    const onConfirm = jest.fn().mockResolvedValueOnce(undefined);
    const { rerender } = await render(<SlideToConfirm label="Slide to pay ₹486" onConfirm={onConfirm} />);
    await fireEvent(screen.getByRole('button', { name: 'Slide to pay ₹486' }), 'accessibilityTap');
    await settle();
    expect(screen.getByRole('button', { name: 'Done' })).toBeTruthy();
    const failing = jest.fn().mockRejectedValue(new Error('declined'));
    await rerender(<SlideToConfirm key="again" label="Slide to pay ₹486" onConfirm={failing} />);
    await fireEvent(screen.getByRole('button', { name: 'Slide to pay ₹486' }), 'accessibilityTap');
    await settle();
    expect(failing).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Slide to pay ₹486' }).props.accessibilityState).toMatchObject({ disabled: false });
  });

  it('Sparkline is one image made of curve segments and an end dot', async () => {
    await render(<Sparkline data={[1, 4, 2, 6]} accessibilityLabel="Savings trend" testID="spark" />);
    expect(screen.getByRole('image', { name: 'Savings trend' })).toBeTruthy();
    expect(screen.getByTestId('spark').children).toHaveLength(3 * 8 + 1);
  });

  it('Receipt names the status', async () => {
    await render(<Receipt status="pending" amount={1200} title="Paid to Ravi Kumar" details={[{ label: 'UTR', value: '4021 8876 1290' }]} />);
    await settle();
    expect(screen.getByRole('image', { name: 'Payment pending' })).toBeTruthy();
    expect(screen.getByLabelText('UTR, 4021 8876 1290')).toBeTruthy();
  });
});
