import type { ReactNode } from 'react';
import type { Tone } from '../utils/tones';

export interface ProgressRingProps {
  /** Progress out of `max` */
  value: number;
  /** @default 100 */
  max?: number;
  /** What it measures, for screen readers, like "Monthly budget used" */
  label: string;
  /** @default 'primary' */
  tone?: Tone;
  /** Diameter in px @default the theme's ring size */
  size?: number;
  /** Stroke width in px @default the theme's ring thickness */
  thickness?: number;
  /** Shown in the middle, like "72%" */
  children?: ReactNode;
  testID?: string;
}
