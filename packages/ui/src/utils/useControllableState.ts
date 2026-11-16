'use client';

import { useCallback, useState } from 'react';

/** State that a parent can control with `value`, or that the component keeps itself when `value` is undefined */
export function useControllableState<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [internal, setInternal] = useState(defaultValue);
  const controlled = value !== undefined;

  const set = useCallback(
    (next: T) => {
      if (!controlled) {
        setInternal(next);
      }
      onChange?.(next);
    },
    [controlled, onChange]
  );

  return [controlled ? value : internal, set] as const;
}
