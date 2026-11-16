import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useReducedMotion } from '../motion/useReducedMotion.native';
import { useTheme } from '../theme/context';
import { textStyleFor } from '../theme/textStyle';
import { controlColors } from '../utils/controls';
import { useControllableState } from '../utils/useControllableState';
import type { SwitchProps } from './Switch.shared';

/** An on/off switch. The thumb glides on a spring and stretches while pressed, like iOS */
export function Switch({ checked, defaultChecked = false, onCheckedChange, label, description, accessibilityLabel, disabled, testID }: SwitchProps) {
  const theme = useTheme();
  const { colors, components, motion, opacity, shadows, space } = theme;
  const look = controlColors(colors);
  const { width, height, thumb } = components.switch;
  const inset = (height - thumb) / 2;
  const [on, setOn] = useControllableState(checked, defaultChecked, onCheckedChange);
  const reduced = useReducedMotion();
  const position = useRef(new Animated.Value(on ? 1 : 0)).current;
  const stretch = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced !== false) {
      position.setValue(on ? 1 : 0);
      return;
    }
    const spring = Animated.spring(position, { toValue: on ? 1 : 0, ...motion.spring.snappy, useNativeDriver: true });
    spring.start();
    return () => spring.stop();
  }, [on, reduced, position, motion]);

  const press = (toValue: number) => () => {
    if (reduced === false) {
      Animated.spring(stretch, { toValue, ...motion.spring.snappy, useNativeDriver: true }).start();
    }
  };
  const travel = width - thumb - 2 * inset;
  // Stretching scales the thumb wider and shifts it toward the middle, so it stays anchored on its side
  const grow = 6;

  const control = (
    <Pressable
      testID={testID}
      accessibilityRole="switch"
      accessibilityLabel={label ?? accessibilityLabel}
      accessibilityHint={description}
      accessibilityState={{ checked: on, disabled: !!disabled }}
      disabled={disabled}
      onPress={() => setOn(!on)}
      onPressIn={press(1)}
      onPressOut={press(0)}
      style={{ width, height, borderRadius: height / 2, opacity: disabled ? opacity.disabled : 1 }}
    >
      <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: height / 2, backgroundColor: look.switchOff }} />
      <Animated.View
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: height / 2, backgroundColor: look.switchOn, opacity: position }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          top: inset,
          left: inset,
          width: thumb,
          height: thumb,
          borderRadius: thumb / 2,
          backgroundColor: look.thumb,
          boxShadow: shadows.sm,
          transform: [
            { translateX: Animated.add(Animated.multiply(position, travel), Animated.multiply(stretch, Animated.add(grow / 2, Animated.multiply(position, -grow)))) },
            { scaleX: Animated.add(1, Animated.multiply(stretch, grow / thumb)) },
          ],
        }}
      />
    </Pressable>
  );
  if (!label) {
    return control;
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.lg }}>
      <View style={{ flexShrink: 1, gap: 2 }}>
        <Text style={[textStyleFor(theme, 'body'), { color: colors.text }]}>{label}</Text>
        {description ? <Text style={[textStyleFor(theme, 'bodySmall'), { color: colors.textMuted }]}>{description}</Text> : null}
      </View>
      {control}
    </View>
  );
}
