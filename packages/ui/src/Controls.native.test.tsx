import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, Animated, Text } from 'react-native';
import { foundations } from '@moksha-ui/tokens';
import { Checkbox, RadioGroup, SegmentedControl, Switch, Tabs } from './index';

const settle = () => act(async () => {});

beforeEach(() => jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false));
afterEach(() => jest.restoreAllMocks());

describe('controls (native)', () => {
  it('Switch toggles with a snappy spring and reports its state', async () => {
    const spring = jest.spyOn(Animated, 'spring');
    await render(<Switch label="International payments" />);
    await settle();
    const control = screen.getByRole('switch', { name: 'International payments' });
    await fireEvent.press(control);
    expect(control.props.accessibilityState).toMatchObject({ checked: true });
    expect(spring).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ toValue: 1, ...foundations.motion.spring.snappy }));
  });

  it('Checkbox toggles, and reports a mixed state', async () => {
    const onCheckedChange = jest.fn();
    const { rerender } = await render(<Checkbox label="Select all payees" onCheckedChange={onCheckedChange} />);
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Select all payees' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    await rerender(<Checkbox label="Select all payees" checked="mixed" />);
    expect(screen.getByRole('checkbox').props.accessibilityState).toMatchObject({ checked: 'mixed' });
  });

  it('RadioGroup selects an option and skips disabled ones', async () => {
    const onValueChange = jest.fn();
    await render(
      <RadioGroup
        label="Pay from"
        defaultValue="savings"
        onValueChange={onValueChange}
        options={[
          { value: 'savings', label: 'Savings' },
          { value: 'salary', label: 'Salary' },
          { value: 'joint', label: 'Joint', disabled: true },
        ]}
      />
    );
    expect(screen.getByRole('radio', { name: 'Savings' }).props.accessibilityState).toMatchObject({ checked: true });
    await fireEvent.press(screen.getByRole('radio', { name: 'Joint' }));
    expect(onValueChange).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('radio', { name: 'Salary' }));
    expect(onValueChange).toHaveBeenCalledWith('salary');
  });

  it('SegmentedControl springs its pill to the chosen option', async () => {
    const spring = jest.spyOn(Animated, 'spring');
    await render(
      <SegmentedControl
        accessibilityLabel="Statement period"
        options={[
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
          { value: 'year', label: 'Year' },
        ]}
      />
    );
    await settle();
    // Fixed-height pill: a long label ends in an ellipsis instead of spilling out
    expect(screen.getByText('Year').props.numberOfLines).toBe(1);
    await fireEvent.press(screen.getByRole('radio', { name: 'Year' }));
    expect(screen.getByRole('radio', { name: 'Year' }).props.accessibilityState).toMatchObject({ checked: true });
    expect(spring).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ toValue: 2, ...foundations.motion.spring.smooth }));
  });

  it('Tabs place the underline on the first layout, then slide it with the smooth spring', async () => {
    const spring = jest.spyOn(Animated, 'spring');
    await render(
      <Tabs
        accessibilityLabel="Account activity"
        items={[
          { value: 'all', label: 'All', content: <Text>Every transaction</Text> },
          { value: 'upi', label: 'UPI', content: <Text>UPI only</Text> },
        ]}
      />
    );
    await settle();
    // A container isn't `accessible` (iOS would merge its tabs into one element), so it's found by label
    expect(screen.getByLabelText('Account activity').props.accessibilityRole).toBe('tablist');
    const [all, upi] = screen.getAllByRole('tab');
    await fireEvent(all!, 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 24, height: 44 } } });
    await fireEvent(upi!, 'layout', { nativeEvent: { layout: { x: 56, y: 0, width: 32, height: 44 } } });
    expect(spring).not.toHaveBeenCalled();
    await fireEvent.press(upi!);
    expect(upi!.props.accessibilityState).toMatchObject({ selected: true });
    expect(screen.getByText('UPI only')).toBeTruthy();
    expect(spring).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ toValue: 56, ...foundations.motion.spring.smooth }));
    expect(spring).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ toValue: 32 }));
  });
});
