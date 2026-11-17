import type { ReactNode } from 'react';
import { ensureContrast, type SemanticColors } from '@moksha-ui/tokens';
import { formatAmount } from '../inputs/format';
import type { TagTone } from '../Tag/Tag.shared';

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface TransactionRowProps {
  /** Who was paid or who paid you, like "Swiggy" */
  name: string;
  /** In rupees, without a sign; `direction` gives the sign */
  amount: number;
  direction: 'debit' | 'credit';
  /** Already formatted, like "Today, 1:24 pm" */
  time: string;
  /** How it moved, like "UPI" or "Card •• 4821" */
  method?: string;
  /** @default 'completed' */
  status?: TransactionStatus;
  /** A logo or avatar. Defaults to the name's initials */
  leading?: ReactNode;
  onPress?: () => void;
  testID?: string;
}

/** "+ ₹ 1,02,400.00" or "− ₹ 486.00", with a true minus sign and no-break spaces so it never splits */
export function transactionAmount({ amount, direction }: Pick<TransactionRowProps, 'amount' | 'direction'>) {
  return `${direction === 'credit' ? '+' : '−'} ₹ ${formatAmount(Math.abs(amount).toFixed(2))}`;
}

/** The row as one sentence: "Paid ₹486.00 to Swiggy, Today, 1:24 pm" */
export function transactionLabel({ name, amount, direction, time, status = 'completed' }: TransactionRowProps) {
  const money = `₹${formatAmount(Math.abs(amount).toFixed(2))}`;
  const party = direction === 'credit' ? `${money} from ${name}` : `${money} to ${name}`;
  const lead = { completed: direction === 'credit' ? 'Received' : 'Paid', pending: 'Pending:', failed: 'Failed:' }[status];
  return `${lead} ${party}, ${time}`;
}

export const statusTags: Record<Exclude<TransactionStatus, 'completed'>, { tone: TagTone; label: string }> = {
  pending: { tone: 'warning', label: 'Pending' },
  failed: { tone: 'danger', label: 'Failed' },
};

/**
 * Money in reads green at AA on both the page and the raised card rows sit on (lighter than the page
 * in dark mode). Money out stays in the text color: red debits read like errors
 */
export function transactionColors(colors: SemanticColors) {
  return { credit: ensureContrast(ensureContrast(colors.success, colors.surfaceRaised), colors.background) };
}
