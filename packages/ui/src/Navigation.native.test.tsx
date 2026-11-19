import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, Animated, View } from 'react-native';
import { foundations, themes } from '@moksha-ui/tokens';
import { AppBar, Breadcrumbs, Pagination, TabBar } from './index';
import { textTones } from './utils/tones';

const settle = () => act(async () => {});

beforeEach(() => jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false));
afterEach(() => jest.restoreAllMocks());

describe('navigation (native)', () => {
  it('Pagination selects pages and disables the arrows at the ends', async () => {
    const onPageChange = jest.fn();
    await render(<Pagination pageCount={10} defaultPage={10} onPageChange={onPageChange} />);
    expect(screen.getByRole('button', { name: 'Page 10' }).props.accessibilityState).toMatchObject({ selected: true });
    expect(screen.getByRole('button', { name: 'Next page' }).props.accessibilityState).toMatchObject({ disabled: true });
    await fireEvent.press(screen.getByRole('button', { name: 'Page 6' }));
    expect(onPageChange).toHaveBeenCalledWith(6);
  });

  it('Pagination drops to 5 slots on a narrow screen', async () => {
    await render(<Pagination pageCount={12} defaultPage={5} testID="pages" />);
    expect(screen.getAllByRole('button', { name: /^Page / })).toHaveLength(5);
    await fireEvent(screen.getByTestId('pages'), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 300, height: 36 } } });
    expect(screen.getAllByRole('button', { name: /^Page / })).toHaveLength(3);
  });

  it('Breadcrumbs link up the path, name the current page, and expand the middle', async () => {
    const onPress = jest.fn();
    const items = [{ label: 'Home', onPress }, { label: 'Accounts' }, { label: 'Savings' }, { label: 'Statements' }, { label: 'October 2026' }];
    await render(<Breadcrumbs items={items} />);
    await fireEvent.press(screen.getByRole('link', { name: 'Home' }));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('October 2026, current page')).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Accounts' })).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Show the full path' }));
    expect(screen.getByRole('link', { name: 'Accounts' })).toBeTruthy();
  });

  it('AppBar has a header title and a back button', async () => {
    const onBack = jest.fn();
    await render(<AppBar title="Savings account" subtitle="•• 4821" onBack={onBack} />);
    expect(screen.getByRole('header', { name: 'Savings account' })).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('TabBar is a tab list: the active icon gets the brand color and the pill springs over', async () => {
    const spring = jest.spyOn(Animated, 'spring');
    const icon = jest.fn((color: string) => <View testID={`icon-${color}`} />);
    await render(
      <TabBar
        items={[
          { value: 'home', label: 'Home', icon },
          { value: 'pay', label: 'Pay', icon, badge: 2 },
        ]}
      />
    );
    await settle();
    expect(screen.getByRole('tab', { name: 'Home' }).props.accessibilityState).toMatchObject({ selected: true });
    expect(icon).toHaveBeenCalledWith(textTones(themes.light.colors).primary);
    await fireEvent.press(screen.getByRole('tab', { name: 'Pay, 2 new' }));
    expect(screen.getByRole('tab', { name: 'Pay, 2 new' }).props.accessibilityState).toMatchObject({ selected: true });
    expect(spring).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ toValue: 1, ...foundations.motion.spring.smooth }));
  });
});
