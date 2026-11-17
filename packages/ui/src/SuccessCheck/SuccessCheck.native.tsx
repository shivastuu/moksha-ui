import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { parseCubicBezier } from '../motion/motion.shared';
import { useReducedMotion } from '../motion/useReducedMotion.native';
import { useTheme } from '../theme/context';
import { solidTones } from '../utils/tones';
import { successTiming as t, type SuccessCheckProps } from './SuccessCheck.shared';

/** A green disc that springs in, a check that draws itself, and a ring that fades out. Plays once on mount */
export function SuccessCheck({ size = 72, accessibilityLabel = 'Success', testID }: SuccessCheckProps) {
  const { colors, motion } = useTheme();
  const reduced = useReducedMotion();
  const tone = solidTones(colors).success;
  const disc = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;
  // 0 to 1 draws the short arm, 1 to 2 the long one
  const draw = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced === null) {
      return;
    }
    if (reduced) {
      disc.setValue(1);
      draw.setValue(2);
      return;
    }
    const enter = Easing.bezier(...parseCubicBezier(motion.easing.enter));
    const play = Animated.parallel([
      Animated.spring(disc, { toValue: 1, ...motion.spring.bouncy, useNativeDriver: true }),
      Animated.timing(ring, { toValue: 1, delay: t.ringDelay, duration: t.ringDuration, easing: Easing.bezier(...parseCubicBezier(motion.easing.exit)), useNativeDriver: true }),
      Animated.timing(draw, { toValue: 2, delay: t.checkDelay, duration: t.checkDuration, easing: enter, useNativeDriver: false }),
    ]);
    play.start();
    return () => play.stop();
  }, [reduced, disc, ring, draw, motion]);

  // The check is the bottom and right edges of a rotated box: short arm along the bottom, long arm up the right
  const arm = { short: size * 0.2, long: size * 0.38, stroke: Math.max(2, size * 0.06) };
  const bar = { position: 'absolute', bottom: 0, height: arm.stroke, borderRadius: arm.stroke / 2, backgroundColor: tone.ink } as const;
  return (
    <View testID={testID} accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel} style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: tone.background,
          opacity: ring.interpolate({ inputRange: [0, 0.001, 1], outputRange: [0, 0.45, 0] }),
          transform: [{ scale: ring.interpolate({ inputRange: [0, 1], outputRange: [1, 1.7] }) }],
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: tone.background,
          boxShadow: `inset 0px 0px 0px 1px ${tone.edge}, 0px 12px 28px -10px ${tone.background}`,
          backgroundImage: `linear-gradient(180deg, ${tone.gloss}, transparent 60%)`,
          transform: [{ scale: disc }],
        }}
      />
      <View style={{ width: arm.short, height: arm.long, marginTop: -size * 0.06, transform: [{ rotate: '45deg' }] }}>
        <Animated.View style={{ ...bar, left: 0, width: draw.interpolate({ inputRange: [0, 1, 2], outputRange: [0, arm.short, arm.short], extrapolate: 'clamp' }) }} />
        <Animated.View
          style={{ ...bar, right: 0, width: arm.stroke, height: draw.interpolate({ inputRange: [0, 1, 2], outputRange: [0, arm.stroke, arm.long], extrapolate: 'clamp' }) }}
        />
      </View>
    </View>
  );
}
