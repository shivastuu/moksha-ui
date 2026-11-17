import { useState } from 'react';
import { Animated, Pressable, Text } from 'react-native';
import { BottomSheet } from '../Dialog/Dialog.native';
import { useShake } from '../motion/nativeMotion.native';
import { useShakeOnError } from '../motion/useShakeOnError';
import { FieldShell } from '../TextField/FieldShell.native';
import { fieldColors } from '../TextField/TextField.shared';
import { useTheme } from '../theme/context';
import { fontFor } from '../theme/textStyle';
import { useControllableState } from '../utils/useControllableState';
import { Calendar } from './Calendar.native';
import { dayText, localToday, parseDay, shortDay, spokenDay, startDay, type DatePickerProps } from './DatePicker.shared';

/** A date field that opens a month calendar in a bottom sheet */
export function DatePicker({ label, value, defaultValue = '', onValueChange, min, max, placeholder = 'Choose a date', helperText, error, disabled, required, weekStartsOn = 0, today, testID }: DatePickerProps) {
  const theme = useTheme();
  const { colors, components } = theme;
  const { field } = components;
  const [text, setText] = useControllableState(value, defaultValue, onValueChange);
  const [open, setOpen] = useState(false);
  const [shaking, shakeDone] = useShakeOnError(error);
  const shakeX = useShake(shaking, shakeDone);
  const selected = parseDay(text);
  const now = parseDay(today) ?? localToday();
  const [low, high] = [parseDay(min), parseDay(max)];
  const accent = error ? colors.danger : colors.primary;

  return (
    <FieldShell label={label} required={required} message={error ?? helperText} invalid={!!error} disabled={disabled}>
      <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
        <Pressable
          testID={testID}
          accessibilityRole="button"
          accessibilityLabel={`${label}, ${selected ? spokenDay(selected) : placeholder}`}
          accessibilityHint={error ?? helperText}
          accessibilityState={{ disabled: !!disabled, expanded: open }}
          disabled={disabled}
          onPress={() => setOpen(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            minHeight: field.sizes.md.height,
            paddingHorizontal: field.sizes.md.paddingX,
            borderRadius: field.radius,
            borderWidth: field.borderWidth,
            borderColor: error || open ? accent : colors.border,
            backgroundColor: colors.background,
            boxShadow: open ? `0px 0px 0px ${field.halo}px ${fieldColors(colors)[error ? 'haloDanger' : 'halo']}` : theme.shadows.sm,
          }}
        >
          <Text style={{ flex: 1, fontSize: field.sizes.md.fontSize, color: selected ? colors.text : colors.textMuted, fontVariant: ['tabular-nums'], ...fontFor(theme, 'regular') }}>
            {selected ? shortDay(selected) : placeholder}
          </Text>
        </Pressable>
      </Animated.View>
      <BottomSheet open={open} onClose={() => setOpen(false)} title={label}>
        <Calendar
          selected={selected}
          start={startDay(selected, now, low, high)}
          today={now}
          min={low}
          max={high}
          weekStartsOn={weekStartsOn}
          onPick={(day) => {
            setText(dayText(day));
            setOpen(false);
          }}
        />
      </BottomSheet>
    </FieldShell>
  );
}
