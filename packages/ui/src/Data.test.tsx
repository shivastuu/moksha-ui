import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { contrastRatio, createTheme, defaultTheme, type ColorScheme } from '@moksha-ui/tokens';
import { DetailRow, EmptyState, ListGroup, StatCard, Tag, TransactionRow } from './index';
import { statLabel, trendTone } from './StatCard/StatCard.shared';
import { transactionAmount, transactionColors, transactionLabel } from './TransactionRow/TransactionRow.shared';

afterEach(cleanup);

describe('DetailRow (web)', () => {
  it('shows a label and a value, and sits in a ListGroup as one row each', () => {
    render(
      <ListGroup title="Details">
        <DetailRow label="Transaction ID" value="UTR 4021 8876 1290" />
        <DetailRow label="Status" value={<Tag tone="success">Paid</Tag>} />
      </ListGroup>
    );
    const rows = within(screen.getByRole('list', { name: 'Details' })).getAllByRole('listitem');
    expect(rows.map((row) => row.textContent)).toEqual(['Transaction IDUTR 4021 8876 1290', 'StatusPaid']);
  });
});

describe('StatCard', () => {
  it('colors the change by whether the move is good news', () => {
    expect([trendTone('up'), trendTone('down'), trendTone('up', false), trendTone('down', false), trendTone('flat', false)]).toEqual([
      'success',
      'danger',
      'danger',
      'success',
      'neutral',
    ]);
  });

  it('draws the arrow but speaks the direction (web)', () => {
    const { container } = render(<StatCard label="Spent this month" value="₹ 42,180" change="12.4%" trend="up" upIsGood={false} caption="vs last month" />);
    const pill = container.querySelector('.ds-stat-card__change')!;
    expect(pill.getAttribute('data-tone')).toBe('danger');
    expect(pill.querySelector('[aria-hidden=true]')?.textContent).toBe('↑');
    expect(pill.querySelector('.ds-visually-hidden')?.textContent).toBe('Up ');
    expect(statLabel({ label: 'Spent this month', value: '₹ 42,180', change: '12.4%', trend: 'up', caption: 'vs last month' })).toBe(
      'Spent this month, ₹ 42,180, Up 12.4% vs last month'
    );
  });
});

describe('EmptyState (web)', () => {
  it('hides the decorative medallion and runs its one action', () => {
    const onPress = vi.fn();
    const { container, rerender } = render(<EmptyState title="No transactions yet" description="Payments you make show up here." />);
    expect(container.querySelector('.ds-empty__medallion')).toBeNull();
    rerender(<EmptyState title="No transactions yet" icon={<svg />} action={{ label: 'Add money', onPress }} />);
    expect(container.querySelector('.ds-empty__medallion')?.getAttribute('aria-hidden')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Add money' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('TransactionRow', () => {
  const swiggy = { name: 'Swiggy', amount: 486, direction: 'debit', time: 'Today, 1:24 pm', method: 'UPI' } as const;

  it('formats the signed amount with Indian grouping, a true minus and no-break spaces', () => {
    expect(transactionAmount(swiggy)).toBe('− ₹ 486.00');
    expect(transactionAmount({ amount: 102400, direction: 'credit' })).toBe('+ ₹ 1,02,400.00');
  });

  it('reads as one sentence for every status', () => {
    expect(transactionLabel(swiggy)).toBe('Paid ₹486.00 to Swiggy, Today, 1:24 pm');
    expect(transactionLabel({ ...swiggy, name: 'Moksha Labs', amount: 102400, direction: 'credit', time: '1 Nov' })).toBe('Received ₹1,02,400.00 from Moksha Labs, 1 Nov');
    expect(transactionLabel({ ...swiggy, status: 'pending' })).toBe('Pending: ₹486.00 to Swiggy, Today, 1:24 pm');
    expect(transactionLabel({ ...swiggy, status: 'failed' })).toBe('Failed: ₹486.00 to Swiggy, Today, 1:24 pm');
  });

  it('keeps money in green at AA on both the page and the raised card, in every theme', () => {
    const themes = [defaultTheme, ...['#E11D48', '#F97316', '#FACC15', '#0E7C66', '#06B6D4', '#7C3AED', '#111111', '#F5F5F5'].map((brandColor) => createTheme({ brandColor }))];
    for (const theme of themes) {
      for (const scheme of ['light', 'dark'] as ColorScheme[]) {
        const { colors } = theme.themes[scheme];
        const { credit } = transactionColors(colors);
        expect(contrastRatio(credit, colors.background), `page, ${scheme}`).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(credit, colors.surfaceRaised), `card, ${scheme}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('is a button with that sentence as its name, and tags pending and failed payments (web)', () => {
    const onPress = vi.fn();
    const { container, rerender } = render(<TransactionRow {...swiggy} onPress={onPress} />);
    fireEvent.click(screen.getByRole('button', { name: 'Paid ₹486.00 to Swiggy, Today, 1:24 pm' }));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByText('UPI · Today, 1:24 pm')).toBeTruthy();
    rerender(<TransactionRow {...swiggy} status="failed" />);
    expect(container.querySelector('.ds-transaction')?.getAttribute('data-status')).toBe('failed');
    expect(screen.getByText('Failed')).toBeTruthy();
  });
});
