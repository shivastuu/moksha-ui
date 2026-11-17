export interface NumberStepperProps {
  /** What is counted, like "Travellers" */
  label: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** @default 0 */
  min?: number;
  /** @default Infinity */
  max?: number;
  /** @default 1 */
  step?: number;
  /** How the value reads, like (months) => `${months} months` */
  format?: (value: number) => string;
  disabled?: boolean;
  testID?: string;
}

export const clampValue = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Round button size in px */
export const stepperButton = 32;
