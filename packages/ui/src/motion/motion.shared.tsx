'use client';

import { Children, isValidElement, type ComponentType, type ReactNode } from 'react';
import type { Foundations } from '@shivastu/tokens';
import { useTheme } from '../theme/context';

export type MotionPreset = 'fade' | 'fadeUp' | 'fadeDown' | 'scaleIn' | 'slideUp';

export interface MotionProps {
  children: ReactNode;
  /** How the content enters @default 'fadeUp' */
  preset?: MotionPreset;
  /** Wait before starting, in ms */
  delay?: number;
  /** Duration token @default 'normal' */
  duration?: keyof Foundations['motion']['duration'];
  /** Easing token @default 'enter' */
  easing?: keyof Foundations['motion']['easing'];
  /** Id for tests: `data-testid` on web, `testID` on native */
  testID?: string;
}

export interface StaggerProps extends Omit<MotionProps, 'delay'> {
  /** Delay between items, in ms. Defaults to the theme's `motion.stagger` */
  interval?: number;
  /** Delay before the first item, in ms */
  delay?: number;
}

/** Where a preset starts from; it always ends at opacity 1, no offset, scale 1 */
export function presetFrom(preset: MotionPreset, motion: Foundations['motion']) {
  switch (preset) {
    case 'fade':
      return { opacity: 0, translateY: 0, scale: 1 };
    case 'fadeUp':
      return { opacity: 0, translateY: motion.distance.md, scale: 1 };
    case 'fadeDown':
      return { opacity: 0, translateY: -motion.distance.md, scale: 1 };
    case 'scaleIn':
      return { opacity: 0, translateY: 0, scale: motion.scale.enter };
    case 'slideUp':
      return { opacity: 0, translateY: motion.distance.lg, scale: 1 };
  }
}

/** "cubic-bezier(0.2, 0, 0, 1)" → [0.2, 0, 0, 1], to use the same curve on native */
export function parseCubicBezier(easing: string): [number, number, number, number] {
  const values = easing.match(/-?\d*\.?\d+/g)?.map(Number);
  if (!values || values.length !== 4) {
    throw new Error(`Expected cubic-bezier(x1, y1, x2, y2), received "${easing}"`);
  }
  return values as [number, number, number, number];
}

/** Wraps each child in `Motion`, each one starting a little later than the previous */
export function createStagger(Motion: ComponentType<MotionProps>) {
  return function Stagger({ children, interval, delay = 0, ...motion }: StaggerProps) {
    const theme = useTheme();
    const step = interval ?? theme.motion.stagger;
    return (
      <>
        {Children.toArray(children).map((child, index) => (
          <Motion key={isValidElement(child) && child.key !== null ? child.key : index} delay={delay + index * step} {...motion}>
            {child}
          </Motion>
        ))}
      </>
    );
  };
}
