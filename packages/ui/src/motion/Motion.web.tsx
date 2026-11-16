'use client';

import { createStagger, type MotionProps } from './motion.shared';

const kebab = (name: string) => name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

/** Animates its content in when it mounts. Reduced motion turns movement into a plain fade */
export function Motion({ children, preset = 'fadeUp', delay, duration = 'normal', easing = 'enter', testID }: MotionProps) {
  return (
    <div
      className={`ds-motion ds-motion--${kebab(preset)}`}
      style={{
        animationDuration: `var(--ds-duration-${duration})`,
        animationTimingFunction: `var(--ds-easing-${easing})`,
        animationDelay: delay ? `${delay}ms` : undefined,
      }}
      data-testid={testID}
    >
      {children}
    </div>
  );
}

export const Stagger = createStagger(Motion);
