import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, Animated, StyleSheet } from 'react-native';
import { foundations } from '@moksha-ui/tokens';
import { Accordion, ListGroup, ListItem } from './index';

const settle = () => act(async () => {});

beforeEach(() => jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false));
afterEach(() => jest.restoreAllMocks());

describe('lists (native)', () => {
  it('ListItem is a button named by its title and value only when pressable', async () => {
    const onPress = jest.fn();
    const { rerender } = await render(<ListItem title="Card limit" trailing="₹ 50,000" />);
    expect(screen.queryByRole('button')).toBeNull();
    // A long value shrinks and wraps in up to half the row instead of covering the title
    expect(StyleSheet.flatten(screen.getByText('₹ 50,000').props.style)).toMatchObject({ flexShrink: 1, maxWidth: '50%' });
    await rerender(<ListItem title="Language" description="Used in the app and SMS" trailing="English" onPress={onPress} />);
    const row = screen.getByRole('button', { name: 'Language, English' });
    expect(row.props.accessibilityHint).toBe('Used in the app and SMS');
    await fireEvent.press(row);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ListGroup draws a divider above every row but the first', async () => {
    await render(
      <ListGroup title="Security">
        <ListItem title="App lock" testID="first" />
        <ListItem title="Change MPIN" testID="second" />
      </ListGroup>
    );
    expect(screen.getByRole('header', { name: 'Security' })).toBeTruthy();
    expect(screen.getByTestId('first').children[0]).toHaveStyle({ borderTopWidth: 0 });
    expect(screen.getByTestId('second').children[0]).toHaveStyle({ borderTopWidth: StyleSheet.hairlineWidth });
  });

  it('Accordion opens one section on the smooth spring, hiding closed content from screen readers', async () => {
    const spring = jest.spyOn(Animated, 'spring');
    const onValueChange = jest.fn();
    await render(
      <Accordion
        onValueChange={onValueChange}
        items={[
          { value: 'limit', title: 'Daily UPI limit', content: 'Up to ₹ 1,00,000 a day.' },
          { value: 'fees', title: 'Fees', content: 'UPI payments are free.' },
        ]}
      />
    );
    await settle();
    const limit = screen.getByRole('button', { name: 'Daily UPI limit' });
    expect(limit.props.accessibilityState).toMatchObject({ expanded: false });
    expect(screen.queryByText('Up to ₹ 1,00,000 a day.')).toBeNull();
    await fireEvent.press(limit);
    expect(limit.props.accessibilityState).toMatchObject({ expanded: true });
    expect(spring).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ toValue: 1, ...foundations.motion.spring.smooth }));
    expect(screen.getByText('Up to ₹ 1,00,000 a day.')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Fees' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['fees']);
    expect(screen.getByRole('button', { name: 'Daily UPI limit' }).props.accessibilityState).toMatchObject({ expanded: false });
  });
});
