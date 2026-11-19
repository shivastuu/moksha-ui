import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useReducedMotion } from '../motion/useReducedMotion.native';
import { surfaceColors } from '../Surface/Surface.shared';
import { useTheme } from '../theme/context';
import { fontFor } from '../theme/textStyle';
import { controlColors } from '../utils/controls';
import { useControllableState } from '../utils/useControllableState';
import type { SegmentedControlProps } from './SegmentedControl.shared';

const inset = 3;

/** A row of choices with a pill that springs to the selected one */
export function SegmentedControl({ options, value, defaultValue, onValueChange, accessibilityLabel, testID }: SegmentedControlProps) {
  const theme = useTheme();
  const { colors, components, motion, radius, shadows, typography } = theme;
  const [selected, setSelected] = useControllableState(value, defaultValue ?? options[0]?.value ?? '', onValueChange);
  const index = options.findIndex((option) => option.value === selected);
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(0);
  const segment = options.length ? (width - 2 * inset) / options.length : 0;
  const position = useRef(new Animated.Value(Math.max(index, 0))).current;

  useEffect(() => {
    if (reduced !== false) {
      position.setValue(Math.max(index, 0));
      return;
    }
    const spring = Animated.spring(position, { toValue: Math.max(index, 0), ...motion.spring.smooth, useNativeDriver: true });
    spring.start();
    return () => spring.stop();
  }, [index, reduced, position, motion]);

  return (
    <View
      testID={testID}
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={{ flexDirection: 'row', height: components.segmented.height, padding: inset, borderRadius: radius.full, backgroundColor: controlColors(colors).segmentTrack }}
    >
      {index >= 0 && segment > 0 ? (
        <Animated.View
          style={{
            position: 'absolute',
            top: inset,
            bottom: inset,
            left: inset,
            width: segment,
            borderRadius: radius.full,
            backgroundColor: colors.surfaceRaised,
            boxShadow: `${shadows.sm}, 0px 0px 0px 1px ${surfaceColors(colors).edge}`,
            transform: [{ translateX: Animated.multiply(position, segment) }],
          }}
        />
      ) : null}
      {options.map((option, position) => (
        <Pressable
          key={option.value}
          accessibilityRole="radio"
          accessibilityLabel={option.label}
          accessibilityState={{ checked: position === index }}
          onPress={() => setSelected(option.value)}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text numberOfLines={1} style={{ color: position === index ? colors.text : colors.textMuted, fontSize: typography.fontSize.sm, ...fontFor(theme, 'medium') }}>{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
