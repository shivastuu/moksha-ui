import { useEffect } from 'react';
import { AccessibilityInfo, Animated, Text, View } from 'react-native';
import { usePop, useShake } from '../motion/nativeMotion.native';
import { Press } from '../motion/Press.native';
import { useShakeOnError } from '../motion/useShakeOnError';
import { surfaceColors } from '../Surface/Surface.shared';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { controlColors } from '../utils/controls';
import { textTones } from '../utils/tones';
import { useControllableState } from '../utils/useControllableState';
import { nextPin, pinKeys, pinPad, pinStatus, type PinKey, type PinPadProps } from './PinPad.shared';

function Dot({ filled, invalid }: { filled: boolean; invalid: boolean }) {
  const { colors } = useTheme();
  const scale = usePop(filled);
  const ink = invalid ? colors.danger : colors.text;
  return (
    <Animated.View
      style={{
        width: pinPad.dot,
        height: pinPad.dot,
        borderRadius: pinPad.dot / 2,
        borderWidth: 1.5,
        borderColor: invalid || filled ? ink : controlColors(colors).boxBorder,
        backgroundColor: filled ? ink : 'transparent',
        transform: [{ scale }],
      }}
    />
  );
}

function Key({ value, onPress }: { value: Exclude<PinKey, ''>; onPress: () => void }) {
  const theme = useTheme();
  const { colors } = theme;
  const remove = value === 'delete';
  return (
    <Press
      object
      ink={remove ? colors.textMuted : colors.text}
      fill={remove ? undefined : colors.surface}
      accessibilityRole="button"
      accessibilityLabel={remove ? 'Delete' : value}
      onPress={onPress}
      style={{
        width: pinPad.key,
        height: pinPad.key,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: pinPad.key / 2,
        boxShadow: remove ? undefined : `0px 0px 0px 1px ${surfaceColors(colors).edge}`,
      }}
    >
      <Text style={{ color: remove ? colors.textMuted : colors.text, fontSize: remove ? 22 : 28, fontVariant: ['tabular-nums'], ...fontFor(theme, 'regular') }}>{remove ? '⌫' : value}</Text>
    </Press>
  );
}

/** A PIN entry: dots that pop as digits land, and a round keypad */
export function PinPad({ label, length = 4, value, defaultValue = '', onValueChange, onComplete, error, testID }: PinPadProps) {
  const theme = useTheme();
  const { colors, space } = theme;
  const [pin, setPin] = useControllableState(value, defaultValue, onValueChange);
  const [shaking, shakeDone] = useShakeOnError(error);
  const shakeX = useShake(shaking, shakeDone);

  useEffect(() => {
    if (error) {
      AccessibilityInfo.announceForAccessibility(error);
    }
  }, [error]);

  const press = (key: PinKey) => {
    const next = nextPin(pin, key, length);
    if (next === pin) {
      return;
    }
    setPin(next);
    AccessibilityInfo.announceForAccessibility(pinStatus(next.length, length));
    if (key !== 'delete' && next.length === length) {
      onComplete?.(next);
    }
  };

  const rows = [0, 3, 6, 9].map((start) => pinKeys.slice(start, start + 3));
  return (
    <View testID={testID} style={{ alignItems: 'center', gap: space.lg }}>
      <Text accessibilityRole="header" style={[textStyleFor(theme, 'title'), { color: colors.text }]}>
        {label}
      </Text>
      <Animated.View
        accessible
        accessibilityLabel={pinStatus(pin.length, length)}
        style={{ flexDirection: 'row', gap: space.lg, paddingVertical: space.sm, transform: [{ translateX: shakeX }] }}
      >
        {Array.from({ length }, (_, index) => (
          <Dot key={index} filled={index < pin.length} invalid={!!error} />
        ))}
      </Animated.View>
      <Text style={[textStyleFor(theme, 'bodySmall'), { minHeight: theme.typography.textStyles.bodySmall.lineHeight, color: textTones(colors).danger, textAlign: 'center' }]}>{error ?? ''}</Text>
      <View style={{ gap: pinPad.rowGap }}>
        {rows.map((row, index) => (
          <View key={index} style={{ flexDirection: 'row', gap: pinPad.columnGap }}>
            {row.map((key) => (key === '' ? <View key="blank" style={{ width: pinPad.key }} /> : <Key key={key} value={key} onPress={() => press(key)} />))}
          </View>
        ))}
      </View>
    </View>
  );
}
