'use client';

import { clock, useResend, type ResendTimerProps } from './ResendTimer.shared';

/** "Resend code in 0:27", then a link-style button. Focusable while waiting, and not announced every second */
export function ResendTimer({ seconds = 30, onResend, label = 'Resend code', testID }: ResendTimerProps) {
  const { remaining, waiting, resend } = useResend(seconds, onResend);
  return (
    <button type="button" className="ds-resend" aria-disabled={waiting} onClick={resend} data-testid={testID}>
      {label}
      {remaining > 0 && (
        <>
          {' in '}
          <span className="ds-resend__clock">{clock(remaining)}</span>
        </>
      )}
    </button>
  );
}
