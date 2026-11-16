'use client';

import { useEffect, useRef, useState } from 'react';

/** True from the moment an error appears until `done()` is called. An error that is there from the start does not shake */
export function useShakeOnError(error?: string) {
  const [shaking, setShaking] = useState(false);
  const hadError = useRef(!!error);

  useEffect(() => {
    if (error && !hadError.current) {
      setShaking(true);
    }
    hadError.current = !!error;
  }, [error]);

  return [shaking, () => setShaking(false)] as const;
}
