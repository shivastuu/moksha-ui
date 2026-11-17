export interface StepIndicatorProps {
  /** Short step names, like ["PAN", "Aadhaar", "Selfie", "Done"] */
  steps: string[];
  /** Index of the step in progress; earlier steps show as done. Pass `steps.length` when every step is done */
  current: number;
  /** What the steps are for, like "KYC progress" @default 'Progress' */
  accessibilityLabel?: string;
  testID?: string;
}

export type StepState = 'complete' | 'current' | 'upcoming';

/** Step circle size in px */
export const stepDot = 28;

export const stepState = (index: number, current: number): StepState => (index < current ? 'complete' : index === current ? 'current' : 'upcoming');

/** "Step 2 of 4: Aadhaar" */
export const stepSummary = (steps: string[], current: number) =>
  current >= steps.length ? `All ${steps.length} steps done` : `Step ${current + 1} of ${steps.length}: ${steps[current]}`;
