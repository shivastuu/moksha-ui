import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { Press } from '../motion/Press.native';
import { useReducedMotion } from '../motion/useReducedMotion.native';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { controlColors } from '../utils/controls';
import { useControllableState } from '../utils/useControllableState';
import { clampValue, stepperButton, type NumberStepperProps } from './NumberStepper.shared';

function Round({ glyph, label, disabled, onPress }: { glyph: string; label: string; disabled: boolean; onPress: () => void }) {
  const theme = useTheme();
  const { colors, opacity } = theme;
  return (
    <Press
      object
      ink={colors.text}
      fill={colors.background}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={6}
      style={{
        width: stepperButton,
        height: stepperButton,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: stepperButton / 2,
        borderWidth: 1.5,
        borderColor: controlColors(colors).boxBorder,
        opacity: disabled ? opacity.disabled : 1,
      }}
    >
      <Text style={{ color: colors.text, fontSize: 18, lineHeight: 20, ...fontFor(theme, 'medium') }}>{glyph}</Text>
    </Press>
  );
}

/** − 2 +, with the new number rolling in from the side it came from. Adjustable for screen readers (swipe up/down) */
export function NumberStepper({ label, value, defaultValue, onValueChange, min = 0, max = Infinity, step = 1, format = String, disabled, testID }: NumberStepperProps) {
  const theme = useTheme();
  const { colors, motion, space, opacity } = theme;
  const [current, setCurrent] = useControllableState(value, defaultValue ?? min, onValueChange);
  const reduced = useReducedMotion();
  const roll = useRef(new Animated.Value(0)).current;
  const previous = useRef(current);

  useEffect(() => {
    if (previous.current === current) {
      return;
    }
    const from = current > previous.current ? 1 : -1;
    previous.current = current;
    if (reduced !== false) {
      return;
    }
    roll.setValue(from);
    const spring = Animated.spring(roll, { toValue: 0, ...motion.spring.snappy, useNativeDriver: true });
    spring.start();
    return () => spring.stop();
  }, [current, reduced, roll, motion]);

  const set = (next: number) => {
    const clamped = clampValue(next, min, max);
    if (!disabled && clamped !== current) {
      setCurrent(clamped);
    }
  };

  return (
    <View testID={testID} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.lg, opacity: disabled ? opacity.disabled : 1 }}>
      <Text style={[textStyleFor(theme, 'body'), { flexShrink: 1, color: colors.text }]}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.xs }}>
        <Round glyph="−" label={`Decrease ${label}`} disabled={!!disabled || current <= min} onPress={() => set(current - step)} />
        <View
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={label}
          accessibilityValue={{ min, max: Number.isFinite(max) ? max : undefined, now: current, text: format(current) }}
          accessibilityState={{ disabled: !!disabled }}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={({ nativeEvent }) => set(current + (nativeEvent.actionName === 'increment' ? step : -step))}
          style={{ minWidth: 36, paddingHorizontal: space.xs, overflow: 'hidden', alignItems: 'center' }}
        >
          <Animated.Text
            style={[
              textStyleFor(theme, 'body'),
              fontFor(theme, 'semibold'),
              {
                color: colors.text,
                fontVariant: ['tabular-nums'],
                opacity: roll.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, 1, 0] }),
                transform: [{ translateY: roll.interpolate({ inputRange: [-1, 1], outputRange: [-12, 12] }) }],
              },
            ]}
          >
            {format(current)}
          </Animated.Text>
        </View>
        <Round glyph="+" label={`Increase ${label}`} disabled={!!disabled || current >= max} onPress={() => set(current + step)} />
      </View>
    </View>
  );
}
