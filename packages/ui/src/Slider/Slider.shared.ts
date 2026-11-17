export interface SliderProps {
  label: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  /** How the value reads, shown beside the label and spoken, like (amount) => `₹ ${amount}` */
  format?: (value: number) => string;
  disabled?: boolean;
  testID?: string;
}

/** Thumb size in px */
export const sliderThumb = 24;

/** A track position (0 to 1) to the nearest step, inside min and max */
export function valueAt(fraction: number, min: number, max: number, step: number) {
  const raw = min + Math.min(1, Math.max(0, fraction)) * (max - min);
  const stepped = min + Math.round((raw - min) / step) * step;
  // Round off float noise from the step math, like 0.30000000000000004
  return Math.min(max, Math.max(min, Number(stepped.toFixed(10))));
}

export const fractionOf = (value: number, min: number, max: number) => (max === min ? 0 : (value - min) / (max - min));
