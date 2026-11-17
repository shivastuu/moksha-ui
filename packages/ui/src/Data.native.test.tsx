import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { themes } from '@moksha-ui/tokens';
import { DetailRow, EmptyState, StatCard, TransactionRow } from './index';
import { softTones } from './utils/tones';
import { transactionColors } from './TransactionRow/TransactionRow.shared';

describe('data display (native)', () => {
  it('DetailRow reads its label and text value as one element', async () => {
    await render(<DetailRow label="Transaction ID" value="UTR 4021 8876 1290" />);
    expect(screen.getByLabelText('Transaction ID, UTR 4021 8876 1290')).toBeTruthy();
  });

  it('StatCard reads as one sentence and tints the change by sentiment', async () => {
    await render(<StatCard label="Saved this month" value="₹ 12,000" change="8%" trend="up" caption="vs last month" />);
    expect(screen.getByLabelText('Saved this month, ₹ 12,000, Up 8% vs last month')).toBeTruthy();
    expect(screen.getByText('↑ 8%', { includeHiddenElements: true })).toHaveStyle({ color: softTones(themes.light.colors).success.ink });
  });

  it('EmptyState runs its action and announces its title as a header', async () => {
    const onPress = jest.fn();
    await render(<EmptyState title="No payees yet" icon={<Text>+</Text>} action={{ label: 'Add payee', onPress }} />);
    expect(screen.getByRole('header', { name: 'No payees yet' })).toBeTruthy();
    expect(screen.queryByText('+')).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Add payee' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('TransactionRow is a button named by the sentence, with money in green', async () => {
    const onPress = jest.fn();
    await render(<TransactionRow name="Moksha Labs" amount={102400} direction="credit" time="1 Nov" method="Salary" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Received ₹1,02,400.00 from Moksha Labs, 1 Nov' }));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByText('+ ₹ 1,02,400.00', { includeHiddenElements: true })).toHaveStyle({ color: transactionColors(themes.light.colors).credit });
  });
});
