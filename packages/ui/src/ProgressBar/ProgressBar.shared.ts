import { mix, type SemanticColors } from '@shivastu/tokens';
import type { Tone } from '../utils/tones';

export interface ProgressBarProps {
  /** Progress out of `max`. Leave it out while the amount of work is unknown */
  value?: number;
  /** @default 100 */
  max?: number;
  /** What is progressing, for screen readers, like "Upload" or "Spend limit used" */
  label: string;
  /** @default 'primary' */
  tone?: Tone;
  /** @default 'md' */
  size?: 'sm' | 'md';
  testID?: string;
}

export const progressFraction = (value: number | undefined, max = 100) =>
  value === undefined ? undefined : Math.min(1, Math.max(0, value / (max || 1)));

/** A faint track, and fills that brighten toward their start */
export function progressColors(colors: SemanticColors) {
  const fill = (color: string) => `linear-gradient(90deg, ${mix(color, colors.background, 0.7)}, ${color})`;
  return {
    track: mix(colors.text, colors.background, 0.08),
    primary: fill(colors.primary),
    success: fill(colors.success),
    warning: fill(colors.warning),
    danger: fill(colors.danger),
  };
}
