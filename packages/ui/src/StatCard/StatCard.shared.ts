export type Trend = 'up' | 'down' | 'flat';

export interface StatCardProps {
  /** What is measured, like "Spent this month" */
  label: string;
  /** The figure, already formatted, like "₹ 42,180" */
  value: string;
  /** How much it changed, like "12.4%" */
  change?: string;
  /** @default 'flat' */
  trend?: Trend;
  /** Whether going up is good news, like savings (true) or bad news, like spending (false) @default true */
  upIsGood?: boolean;
  /** Context for the change, like "vs last month" */
  caption?: string;
  testID?: string;
}

export const trendArrows: Record<Trend, string> = { up: '↑', down: '↓', flat: '→' };

export const trendWords: Record<Trend, string> = { up: 'Up', down: 'Down', flat: 'No change,' };

/** Green for good news, red for bad, gray when nothing moved */
export function trendTone(trend: Trend, upIsGood = true) {
  if (trend === 'flat') {
    return 'neutral';
  }
  return (trend === 'up') === upIsGood ? 'success' : 'danger';
}

/** The whole card as one sentence: "Spent this month, ₹ 42,180, Up 12.4% vs last month" */
export function statLabel({ label, value, change, trend = 'flat', caption }: StatCardProps) {
  const moved = change ? [trendWords[trend], change, caption].filter(Boolean).join(' ') : caption;
  return [label, value, moved].filter(Boolean).join(', ');
}
