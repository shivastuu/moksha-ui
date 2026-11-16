import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useTheme } from '../theme/context';
import { parseCubicBezier } from './motion.shared';
import { useReducedMotion } from './useReducedMotion.native';

/** Scales a pressable down while it is held */
export function usePressScale() {
  const { motion } = useTheme();
  const reduced = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) => () => {
    if (reduced) {
      return;
    }
    Animated.timing(scale, {
      toValue,
      duration: motion.duration.fast,
      easing: Easing.bezier(...parseCubicBezier(motion.easing.standard)),
      useNativeDriver: true,
    }).start();
  };

  return { scale, onPressIn: animateTo(motion.scale.pressed), onPressOut: animateTo(1) };
}

/** A small side-to-side shake while `shaking` is true, then calls `done` */
export function useShake(shaking: boolean, done: () => void) {
  const { motion } = useTheme();
  const reduced = useReducedMotion();
  const offset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!shaking) {
      return;
    }
    if (reduced) {
      done();
      return;
    }
    const distance = motion.distance.sm;
    const step = motion.duration.slow / 5;
    Animated.sequence(
      [distance, -distance, distance / 2, -distance / 2, 0].map((toValue) =>
        Animated.timing(offset, { toValue, duration: step, useNativeDriver: true })
      )
    ).start(done);
  }, [shaking]);

  return offset;
}

/** Pops a value in (scale up, then settle) whenever `trigger` turns truthy */
export function usePop(trigger: unknown) {
  const { motion } = useTheme();
  const reduced = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!trigger || reduced) {
      return;
    }
    scale.setValue(motion.scale.pop);
    Animated.timing(scale, {
      toValue: 1,
      duration: motion.duration.normal,
      easing: Easing.bezier(...parseCubicBezier(motion.easing.enter)),
      useNativeDriver: true,
    }).start();
  }, [trigger]);

  return scale;
}
