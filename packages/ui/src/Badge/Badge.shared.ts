export type BadgeTone = 'danger' | 'primary' | 'success' | 'warning' | 'neutral';

export interface BadgeProps {
  /** A count; hidden at 0 */
  count?: number;
  /** Counts above this show as "99+" @default 99 */
  max?: number;
  /** A small dot instead of a number */
  dot?: boolean;
  /** @default 'danger' */
  tone?: BadgeTone;
  /** What it means for screen readers, like "3 unread messages". A dot without a label is decorative */
  label?: string;
  testID?: string;
}

/** The text shown, or null when there is nothing to show */
export const badgeText = ({ count = 0, max = 99, dot }: BadgeProps) => (dot ? '' : count > 0 ? (count > max ? `${max}+` : String(count)) : null);
