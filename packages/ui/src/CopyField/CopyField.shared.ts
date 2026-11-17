'use client';

import { useEffect, useState } from 'react';

export interface CopyFieldProps {
  /** What the value is, like "UPI ID" */
  label: string;
  /** What gets copied, like "shivastu@moksha" */
  value: string;
  /**
   * Puts the value on the clipboard. The web uses the system clipboard when this is left out. On React Native
   * pass your clipboard's setter, like expo-clipboard's `setStringAsync`; without it the value is only
   * long-press selectable
   */
  onCopy?: (value: string) => void | Promise<unknown>;
  testID?: string;
}

/** How long the check mark stays, in ms */
export const copiedFor = 2000;

/** Copies, and reports success only once the copy has actually resolved */
export function useCopy(value: string, copy: CopyFieldProps['onCopy']) {
  const [copiedAt, setCopiedAt] = useState<number>();

  useEffect(() => {
    if (copiedAt === undefined) {
      return;
    }
    const timer = setTimeout(() => setCopiedAt(undefined), copiedFor);
    return () => clearTimeout(timer);
  }, [copiedAt]);

  const run = async () => {
    try {
      await copy!(value);
      setCopiedAt(Date.now());
      return true;
    } catch {
      return false;
    }
  };

  return { copied: copiedAt !== undefined, run };
}
