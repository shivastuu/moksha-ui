import { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, Text, View } from 'react-native';
import { useReducedMotion } from '../motion/useReducedMotion.native';
import { surfaceColors } from '../Surface/Surface.shared';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { controlColors } from '../utils/controls';
import { useControllableState } from '../utils/useControllableState';
import { fractionOf, sliderThumb, valueAt, type SliderProps } from './Slider.shared';

/** A slider: brand fill, a thumb that swells while held, and the value beside the label. Adjustable for screen readers */
export function Slider({ label, value, defaultValue, onValueChange, min = 0, max = 100, step = 1, format = String, disabled, testID }: SliderProps) {
  const theme = useTheme();
  const { colors, components, motion, space, radius, shadows, opacity } = theme;
  const look = controlColors(colors);
  const [current, setCurrent] = useControllableState(value, defaultValue ?? min, onValueChange);
  const [width, setWidth] = useState(0);
  const reduced = useReducedMotion();
  const held = useRef(new Animated.Value(1)).current;
  const swell = (toValue: number) => reduced === false && Animated.spring(held, { toValue, ...motion.spring.snappy, useNativeDriver: true }).start();

  const set = (x: number) => {
    const next = valueAt(x / Math.max(1, width - sliderThumb), min, max, step);
    if (next !== current) {
      setCurrent(next);
    }
  };

  // The responder is created once, so it reads this render's handlers through a ref, never stale ones
  const latest = useRef({ set, swell, disabled, start: 0 });
  Object.assign(latest.current, { set, swell, disabled });

  // Thumb and fill ignore touches, so locationX is always measured from the track's left edge
  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !latest.current.disabled,
      onMoveShouldSetPanResponder: () => !latest.current.disabled,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (event) => {
        latest.current.start = event.nativeEvent.locationX - sliderThumb / 2;
        latest.current.set(latest.current.start);
        latest.current.swell(1.15);
      },
      onPanResponderMove: (_, gesture) => latest.current.set(latest.current.start + gesture.dx),
      onPanResponderRelease: () => latest.current.swell(1),
      onPanResponderTerminate: () => latest.current.swell(1),
    })
  ).current;

  useEffect(() => () => held.stopAnimation(), [held]);

  const left = fractionOf(current, min, max) * Math.max(0, width - sliderThumb);
  return (
    <View testID={testID} style={{ gap: space.sm, opacity: disabled ? opacity.disabled : 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: space.md }}>
        <Text style={[textStyleFor(theme, components.field.labelStyle), { color: colors.text }]}>{label}</Text>
        <Text importantForAccessibility="no" style={[textStyleFor(theme, 'body'), fontFor(theme, 'semibold'), { color: colors.text, fontVariant: ['tabular-nums'] }]}>
          {format(current)}
        </Text>
      </View>
      <View
        {...responder.panHandlers}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ min, max, now: current, text: format(current) }}
        accessibilityState={{ disabled: !!disabled }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={({ nativeEvent }) =>
          !disabled && setCurrent(valueAt(fractionOf(current + (nativeEvent.actionName === 'increment' ? step : -step), min, max), min, max, step))
        }
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        style={{ height: sliderThumb + 4, justifyContent: 'center' }}
      >
        <View pointerEvents="none" style={{ height: 6, borderRadius: radius.full, backgroundColor: look.switchOff, overflow: 'hidden' }}>
          <View style={{ width: left + sliderThumb / 2, height: 6, backgroundColor: look.indicator }} />
        </View>
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left,
            width: sliderThumb,
            height: sliderThumb,
            borderRadius: sliderThumb / 2,
            backgroundColor: look.thumb,
            boxShadow: `${shadows.md}, 0px 0px 0px 1px ${surfaceColors(colors).edge}`,
            transform: [{ scale: held }],
          }}
        />
      </View>
      <View importantForAccessibility="no-hide-descendants" accessibilityElementsHidden style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[textStyleFor(theme, 'caption'), { color: colors.textMuted }]}>{format(min)}</Text>
        <Text style={[textStyleFor(theme, 'caption'), { color: colors.textMuted }]}>{format(max)}</Text>
      </View>
    </View>
  );
}
