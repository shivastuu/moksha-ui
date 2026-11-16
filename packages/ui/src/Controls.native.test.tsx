import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, Animated } from 'react-native';
import { foundations } from 'tandemui-tokens';
import { Checkbox, RadioGroup, SegmentedControl, Switch } from './index';

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
    await fireEvent.press(screen.getByRole('radio', { name: 'Year' }));
    expect(screen.getByRole('radio', { name: 'Year' }).props.accessibilityState).toMatchObject({ checked: true });
    expect(spring).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ toValue: 2, ...foundations.motion.spring.smooth }));
  });
});
