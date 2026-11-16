import { formatAmount } from '../inputs/format';

export type RollingAmountSize = 'md' | 'lg' | 'xl' | 'hero';

export interface RollingAmountProps {
  value: number;
  /** @default '₹' */
  currency?: string;
  /** Decimal places shown @default 2 */
  decimals?: number;
  /** Rolls every digit away into a dot, for a "hide balance" toggle. Screen readers hear "Balance hidden" */
  hidden?: boolean;
  /** md, lg, xl map to the xl, 2xl and 3xl font sizes; hero is 1.5 times 3xl, for the main balance @default 'lg' */
  size?: RollingAmountSize;
  /** Rolls each digit up from 0 when it first appears @default true */
  rollOnMount?: boolean;
  testID?: string;
}

/** A reel: the ten digits, then the dot a hidden digit rolls to */
export const reelDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '•'];

export const hiddenRow = 10;

/** "-24580.5" → { sign: '-', grouped: "24,580.50" } with Indian grouping */
export function amountText(value: number, decimals: number) {
  return { sign: value < 0 ? '-' : '', grouped: formatAmount(Math.abs(value).toFixed(decimals)) };
}

export const spokenAmount = ({ value, currency = '₹', decimals = 2, hidden }: RollingAmountProps) => {
  const { sign, grouped } = amountText(value, decimals);
  return hidden ? 'Balance hidden' : `${sign}${currency}${grouped}`;
};

/**
 * Each character with a key counted from the right, so a digit keeps its reel when the number
 * grows or shrinks (the units reel stays the units reel from 9,999 to 10,000)
 */
export const reels = (grouped: string) => {
  const dot = grouped.indexOf('.');
  return [...grouped].map((char, index, all) => ({
    char,
    place: all.length - 1 - index,
    digit: /\d/.test(char) ? Number(char) : null,
    /** Decimals are drawn smaller, like most banking apps */
    fraction: dot !== -1 && index >= dot,
  }));
};
