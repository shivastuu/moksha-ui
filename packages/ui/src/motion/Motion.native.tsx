import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useTheme } from '../theme/context';
import { createStagger, parseCubicBezier, presetFrom, type MotionProps } from './motion.shared';
import { useReducedMotion } from './useReducedMotion.native';

const between = (progress: Animated.Value, from: number, to: number) =>
  progress.interpolate({ inputRange: [0, 1], outputRange: [from, to] });

/** Animates its content in when it mounts. Reduce Motion shows it right away */
export function Motion({ children, preset = 'fadeUp', delay = 0, duration = 'normal', easing = 'enter', spring, testID }: MotionProps) {
  const { motion } = useTheme();
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced === null) {
      return;
    }
    if (reduced) {
      progress.setValue(1);
      return;
    }
    const animation = spring
      ? Animated.spring(progress, { toValue: 1, ...motion.spring[spring], delay, useNativeDriver: true })
      : Animated.timing(progress, {
          toValue: 1,
          duration: motion.duration[duration],
          delay,
          easing: Easing.bezier(...parseCubicBezier(motion.easing[easing])),
          useNativeDriver: true,
        });
    animation.start();
    return () => animation.stop();
  }, [reduced, progress, motion, duration, delay, easing, spring]);

  const from = presetFrom(preset, motion);

  return (
    <Animated.View
      testID={testID}
      style={{
        opacity: between(progress, from.opacity, 1),
        transform: [{ translateY: between(progress, from.translateY, 0) }, { scale: between(progress, from.scale, 1) }],
      }}
    >
      {children}
    </Animated.View>
  );
}

export const Stagger = createStagger(Motion);
