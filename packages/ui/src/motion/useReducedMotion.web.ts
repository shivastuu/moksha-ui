'use client';

import { useEffect, useState } from 'react';

const query = '(prefers-reduced-motion: reduce)';

/** Whether the user asked for less motion. `null` until known */
export function useReducedMotion() {
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      setReduced(false);
      return;
    }
    const media = window.matchMedia(query);
    setReduced(media.matches);
    const update = (event: MediaQueryListEvent) => setReduced(event.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
}
