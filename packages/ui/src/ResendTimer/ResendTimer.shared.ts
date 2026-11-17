'use client';

import { useEffect, useState } from 'react';

export interface ResendTimerProps {
  /** Seconds to wait before the first resend and after each one @default 30 */
  seconds?: number;
  /** Sends a new code. The countdown restarts once it resolves; if it rejects, the user can resend straight away */
  onResend: () => void | Promise<unknown>;
  /** @default 'Resend code' */
  label?: string;
  testID?: string;
}

/** 75 → "1:15" */
export const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

/**
 * Seconds left, counted down to an end time and re-read from the clock on every tick, so it is still
 * right after the app sleeps or the browser throttles a background tab
 */
export function useResend(seconds: number, onResend: ResendTimerProps['onResend']) {
  const [end, setEnd] = useState(() => Date.now() + seconds * 1000);
  const [now, setNow] = useState(() => Date.now());
  const [sending, setSending] = useState(false);
  const remaining = Math.max(0, Math.ceil((end - now) / 1000));
  const done = remaining === 0;

  useEffect(() => {
    if (done) {
      return;
    }
    const tick = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(tick);
  }, [done, end]);

  const resend = async () => {
    if (!done || sending) {
      return;
    }
    setSending(true);
    try {
      await onResend();
      const start = Date.now();
      setEnd(start + seconds * 1000);
      setNow(start);
    } catch {
      // Fail closed: no new countdown, so the user can try again at once. Showing the error is the app's job
    } finally {
      setSending(false);
    }
  };

  return { remaining, waiting: !done || sending, resend };
}
