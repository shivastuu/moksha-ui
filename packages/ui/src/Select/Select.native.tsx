import { useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { BottomSheet } from '../Dialog/Dialog.native';
import { CheckIcon } from '../Icon/CheckIcon.native';
import { ChevronIcon } from '../Icon/ChevronIcon.native';
import { useShake } from '../motion/nativeMotion.native';
import { useShakeOnError } from '../motion/useShakeOnError';
import { FieldShell } from '../TextField/FieldShell.native';
import { fieldColors } from '../TextField/TextField.shared';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { controlColors } from '../utils/controls';
import { textTones } from '../utils/tones';
import { useControllableState } from '../utils/useControllableState';
import type { SelectProps } from './Select.shared';

/** A field that opens a bottom sheet of options */
export function Select({ label, options, value, defaultValue = '', onValueChange, placeholder, helperText, error, disabled, required, testID }: SelectProps) {
  const theme = useTheme();
  const { colors, components, space, radius, opacity } = theme;
  const { field } = components;
  const [selected, setSelected] = useControllableState(value, defaultValue, onValueChange);
  const [open, setOpen] = useState(false);
  const [shaking, shakeDone] = useShakeOnError(error);
  const shakeX = useShake(shaking, shakeDone);
  const chosen = options.find((option) => option.value === selected);
  const accent = error ? colors.danger : colors.primary;

  return (
    <FieldShell label={label} required={required} message={error ?? helperText} invalid={!!error} disabled={disabled}>
      <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
        <Pressable
          testID={testID}
          accessibilityRole="button"
          accessibilityLabel={`${label}, ${chosen?.label ?? placeholder ?? 'nothing chosen'}`}
          accessibilityHint={error ?? helperText}
          accessibilityState={{ disabled: !!disabled, expanded: open }}
          disabled={disabled}
          onPress={() => setOpen(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: field.gap,
            minHeight: field.sizes.md.height,
            paddingHorizontal: field.sizes.md.paddingX,
            borderRadius: field.radius,
            borderWidth: field.borderWidth,
            borderColor: error || open ? accent : colors.border,
            backgroundColor: colors.background,
            boxShadow: open ? `0px 0px 0px ${field.halo}px ${fieldColors(colors)[error ? 'haloDanger' : 'halo']}` : theme.shadows.sm,
          }}
        >
          <Text numberOfLines={1} style={{ flex: 1, fontSize: field.sizes.md.fontSize, color: chosen ? colors.text : colors.textMuted, ...fontFor(theme, 'regular') }}>
            {chosen?.label ?? placeholder ?? ''}
          </Text>
          <ChevronIcon direction="down" />
        </Pressable>
      </Animated.View>
      <BottomSheet open={open} onClose={() => setOpen(false)} title={label}>
        <View accessibilityRole="radiogroup" style={{ gap: space.xs }}>
          {options.map((option) => {
            const checked = option.value === selected;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ checked, disabled: !!option.disabled }}
                disabled={option.disabled}
                onPress={() => {
                  setSelected(option.value);
                  setOpen(false);
                }}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: 48,
                  paddingHorizontal: space.md,
                  borderRadius: radius.md,
                  backgroundColor: checked ? controlColors(colors).selectedFill : pressed ? colors.border : 'transparent',
                  opacity: option.disabled ? opacity.disabled : 1,
                })}
              >
                <Text style={[textStyleFor(theme, 'body'), checked ? fontFor(theme, 'medium') : null, { color: colors.text }]}>{option.label}</Text>
                {checked ? <CheckIcon color={textTones(colors).primary} size={18} /> : null}
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </FieldShell>
  );
}
