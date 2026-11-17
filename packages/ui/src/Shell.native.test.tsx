import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, Text, View } from 'react-native';
import { CardStack, Select, Sidebar } from './index';

const settle = () => act(async () => {});

beforeEach(() => jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true));
afterEach(() => jest.restoreAllMocks());

describe('shell (native)', () => {
  it('Select opens a sheet of radios and closes on a choice', async () => {
    const onValueChange = jest.fn();
    await render(<Select label="Bank" placeholder="Choose a bank" onValueChange={onValueChange} options={[{ value: 'hdfc', label: 'HDFC Bank' }, { value: 'icici', label: 'ICICI Bank' }]} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Bank, Choose a bank' }));
    await settle();
    await fireEvent.press(screen.getByRole('radio', { name: 'ICICI Bank' }));
    expect(onValueChange).toHaveBeenCalledWith('icici');
    expect(screen.getByRole('button', { name: 'Bank, ICICI Bank' })).toBeTruthy();
    expect(screen.queryByRole('radio', { name: 'ICICI Bank' })).toBeNull();
  });

  it('Sidebar selects rows and names counts', async () => {
    const onValueChange = jest.fn();
    await render(
      <Sidebar
        onValueChange={onValueChange}
        sections={[{ title: 'Money', items: [{ value: 'accounts', label: 'Accounts', icon: (color) => <View testID={`icon-${color}`} /> }, { value: 'requests', label: 'Requests', count: 3 }] }]}
      />
    );
    expect(screen.getByRole('header', { name: 'Money' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Accounts' }).props.accessibilityState).toMatchObject({ selected: true });
    await fireEvent.press(screen.getByRole('button', { name: 'Requests, 3 new' }));
    expect(onValueChange).toHaveBeenCalledWith('requests');
  });

  it('CardStack offers the cards behind as buttons and announces the new front card', async () => {
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    const onIndexChange = jest.fn();
    const cards = ['Moksha •• 4821', 'Moksha Metal •• 2290'].map((label) => ({ key: label, label, card: <Text>{label}</Text> }));
    await render(<CardStack cards={cards} onIndexChange={onIndexChange} />);
    await settle();
    expect(screen.queryByRole('button', { name: 'Show Moksha •• 4821' })).toBeNull();
    expect(screen.queryByText('Moksha Metal •• 2290')).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Show Moksha Metal •• 2290' }));
    expect(onIndexChange).toHaveBeenCalledWith(1);
    expect(announce).toHaveBeenCalledWith('Showing Moksha Metal •• 2290');
  });
});
