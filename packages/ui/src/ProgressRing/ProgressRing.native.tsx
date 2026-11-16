import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { useReducedMotion } from '../motion/useReducedMotion.native';
import { progressColors, progressFraction } from '../ProgressBar/ProgressBar.shared';
import { useTheme } from '../theme/context';
import type { ProgressRingProps } from './ProgressRing.shared';

/**
 * A circular gauge whose arc springs to its value. Without SVG, the arc is two clipped half rings:
 * a ring with only its top and right borders colored is a half circle, and rotating it inside a
 * half-width clip reveals as much of that side as the progress needs
 */
export function ProgressRing({ value, max = 100, label, tone = 'primary', size, thickness, children, testID }: ProgressRingProps) {
  const { colors, components, motion } = useTheme();
  const reduced = useReducedMotion();
  const diameter = size ?? components.progress.ring.size;
  const stroke = thickness ?? components.progress.ring.thickness;
  const half = diameter / 2;
  const fraction = progressFraction(value, max) ?? 0;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced === null) {
      return;
    }
    if (reduced) {
      progress.setValue(fraction);
      return;
    }
    const spring = Animated.spring(progress, { toValue: fraction, ...motion.spring.smooth, useNativeDriver: true });
    spring.start();
    return () => spring.stop();
  }, [fraction, reduced, progress, motion]);

  const color = colors[tone];
  const ring = { position: 'absolute' as const, top: 0, width: diameter, height: diameter, borderRadius: half, borderWidth: stroke };
  const arc = (rotate: Animated.AnimatedInterpolation<string>) => (
    <Animated.View style={[ring, { borderColor: 'transparent', borderTopColor: color, borderRightColor: color, transform: [{ rotate }] }]} />
  );

  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max, now: value }}
      style={{ width: diameter, height: diameter, alignItems: 'center', justifyContent: 'center' }}
    >
      <View style={[ring, { left: 0, borderColor: progressColors(colors).track }]} />
      {/* Right half: 0 to 50% */}
      <View style={{ position: 'absolute', top: 0, left: half, width: half, height: diameter, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', top: 0, left: -half, width: diameter, height: diameter }}>
          {arc(progress.interpolate({ inputRange: [0, 0.5], outputRange: ['-135deg', '45deg'], extrapolate: 'clamp' }))}
        </View>
      </View>
      {/* Left half: 50 to 100% */}
      <View style={{ position: 'absolute', top: 0, left: 0, width: half, height: diameter, overflow: 'hidden' }}>
        {arc(progress.interpolate({ inputRange: [0.5, 1], outputRange: ['45deg', '225deg'], extrapolate: 'clamp' }))}
      </View>
      {children}
    </View>
  );
}
