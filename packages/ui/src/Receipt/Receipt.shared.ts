import type { ReactNode } from 'react';

export type ReceiptStatus = 'success' | 'pending' | 'failed';

export interface ReceiptProps {
  status: ReceiptStatus;
  /** In rupees */
  amount: number;
  /** Like "Paid to Swiggy" */
  title: string;
  /** Like "17 Nov 2026, 1:24 pm" */
  subtitle?: string;
  /** Label and value rows under the tear line */
  details: { label: string; value: ReactNode }[];
  /** Buttons under the receipt, like Share and Download */
  actions?: ReactNode;
  testID?: string;
}

/** Spoken with the amount, so the status is never only an icon */
export const receiptStatusWords: Record<ReceiptStatus, string> = { success: 'Payment successful', pending: 'Payment pending', failed: 'Payment failed' };

/** Status disc size and the notch radius of the tear line, in px */
export const receipt = { status: 64, notch: 12 };
