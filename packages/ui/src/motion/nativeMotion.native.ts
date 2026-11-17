import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useTheme } from '../theme/context';
import { parseCubicBezier } from './motion.shared';
import { useReducedMotion } from './useReducedMotion.native';

/** Scales a pressable down while it is held, on the snappy spring, the same as the web */
export function usePressScale() {
  const { motion } = useTheme();
  const reduced = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) => () => {
    if (reduced) {
      return;
    }
    Animated.spring(scale, { toValue, ...motion.spring.snappy, useNativeDriver: true }).start();
  };

  return { scale, onPressIn: animateTo(motion.scale.pressed), onPressOut: animateTo(1) };
}

/**
 * A breath for loaders: 0 → 1 → 0 on the theme's breathe rhythm (sine in-out), forever, on the native driver.
 * Map it to opacity with `breathOpacity`. Holds still at 0 with reduced motion or when not `active`
 */
export function useBreathe(active = true) {
  const { motion } = useTheme();
  const reduced = useReducedMotion();
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active || reduced !== false) {
      value.setValue(0);
      return;
    }
    const half = { duration: motion.breathe.period / 2, easing: Easing.bezier(...parseCubicBezier(motion.breathe.easing)), useNativeDriver: true };
    const loop = Animated.loop(Animated.sequence([Animated.timing(value, { toValue: 1, ...half }), Animated.timing(value, { toValue: 0, ...half })]));
    loop.start();
    return () => loop.stop();
  }, [active, reduced, value, motion]);

  return value;
}

/** Full opacity at the in-breath, the theme's `low` at the out-breath */
export const breathOpacity = (breath: Animated.Value, low: number) => breath.interpolate({ inputRange: [0, 1], outputRange: [1, low] });

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
