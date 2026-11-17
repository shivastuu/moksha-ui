export interface SlideToConfirmProps {
  /** What sliding does, like "Slide to pay ₹486" */
  label: string;
  /** Runs once the knob is released at the end. If it rejects, the knob springs back and the user can try again */
  onConfirm: () => void | Promise<unknown>;
  /** Shown while onConfirm runs @default 'Processing' */
  pendingLabel?: string;
  /** Shown once onConfirm resolves @default 'Done' */
  doneLabel?: string;
  disabled?: boolean;
  testID?: string;
}

export type SlideState = 'idle' | 'pending' | 'done';

/** Sizes in px, and how far the knob must be (0 to 1) when released to confirm */
export const slide = { height: 60, knob: 52, inset: 4, threshold: 0.9 };

export const clampOffset = (offset: number, travel: number) => Math.min(travel, Math.max(0, offset));
