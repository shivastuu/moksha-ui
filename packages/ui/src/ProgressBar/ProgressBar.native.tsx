import { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { breathOpacity, useBreathe } from '../motion/nativeMotion.native';
import { useReducedMotion } from '../motion/useReducedMotion.native';
import { useTheme } from '../theme/context';
import { progressColors, progressFraction, type ProgressBarProps } from './ProgressBar.shared';

/** A bar whose fill springs to its value, or breathes while the amount of work is unknown */
export function ProgressBar({ value, max = 100, label, tone = 'primary', size = 'md', testID }: ProgressBarProps) {
  const { colors, components, radius, motion } = useTheme();
  const look = progressColors(colors);
  const fraction = progressFraction(value, max);
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(0);
  const offset = useRef(new Animated.Value(-1)).current;
  const unknown = fraction === undefined;
  const breath = useBreathe(unknown);

  useEffect(() => {
    if (fraction === undefined) {
      // The whole fill breathes instead (see the opacity below)
      offset.setValue(0);
      return;
    }
    if (reduced !== false) {
      offset.setValue(fraction - 1);
      return;
    }
    const spring = Animated.spring(offset, { toValue: fraction - 1, ...motion.spring.smooth, useNativeDriver: true });
    spring.start();
    return () => spring.stop();
  }, [fraction, reduced, offset, motion]);

  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={fraction === undefined ? undefined : { min: 0, max, now: value }}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={{ width: '100%', height: components.progress.bar[size], overflow: 'hidden', borderRadius: radius.full, backgroundColor: look.track }}
    >
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          borderRadius: radius.full,
          backgroundImage: look[tone],
          // Unknown amount of work: breathes like every loader; with reduced motion it holds dimmed, so it never reads as done
          opacity: unknown ? (reduced === true ? motion.breathe.low : breathOpacity(breath, motion.breathe.low)) : 1,
          transform: [{ translateX: Animated.multiply(offset, width) }],
        }}
      />
    </View>
  );
}
