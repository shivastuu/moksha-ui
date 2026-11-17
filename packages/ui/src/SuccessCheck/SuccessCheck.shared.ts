export interface SuccessCheckProps {
  /** Diameter in px @default 72 */
  size?: number;
  /** What succeeded, for screen readers, like "Payment successful" @default 'Success' */
  accessibilityLabel?: string;
  testID?: string;
}

/** When each part starts and how long it takes, in ms: the disc springs in, then the check draws, then a ring fades out */
export const successTiming = { checkDelay: 260, checkDuration: 420, ringDelay: 120, ringDuration: 900 };
