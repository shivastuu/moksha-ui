import { useState } from 'react';
import { Animated, Text, TextInput } from 'react-native';
import { useShake } from '../motion/nativeMotion.native';
import { useShakeOnError } from '../motion/useShakeOnError';
import { FieldShell } from '../TextField/FieldShell.native';
import { fieldColors } from '../TextField/TextField.shared';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { textTones } from '../utils/tones';
import { useControllableState } from '../utils/useControllableState';
import { countLabel, type TextAreaProps } from './TextArea.shared';

/** A multi-line field that grows with its text, with a character counter in the corner */
export function TextArea({
  label,
  hideLabel,
  value,
  defaultValue = '',
  onChangeText,
  placeholder,
  helperText,
  error,
  disabled,
  required,
  maxLength,
  rows = 3,
  maxRows = 8,
  testID,
}: TextAreaProps) {
  const theme = useTheme();
  const { colors, components, space, typography } = theme;
  const { field } = components;
  const [text, setText] = useControllableState(value, defaultValue, onChangeText);
  const [focused, setFocused] = useState(false);
  const [shaking, shakeDone] = useShakeOnError(error);
  const shakeX = useShake(shaking, shakeDone);
  const line = typography.lineHeight.md;
  const accent = error ? colors.danger : colors.primary;

  return (
    <FieldShell label={label} hideLabel={hideLabel} required={required} message={error ?? helperText} invalid={!!error} disabled={disabled}>
      <Animated.View
        style={{
          gap: space.xs,
          paddingHorizontal: field.sizes.md.paddingX,
          paddingVertical: space.md,
          borderRadius: field.radius,
          borderWidth: field.borderWidth,
          borderColor: error || focused ? accent : colors.border,
          backgroundColor: colors.background,
          boxShadow: focused ? `0px 0px 0px ${field.halo}px ${fieldColors(colors)[error ? 'haloDanger' : 'halo']}` : disabled ? undefined : theme.shadows.sm,
          transform: [{ translateX: shakeX }],
        }}
      >
        {/* A multiline input grows with its content on its own; the bounds keep it between rows and maxRows */}
        <TextInput
          multiline
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          maxLength={maxLength}
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
          accessibilityHint={[error ?? helperText, maxLength !== undefined ? countLabel(text.length, maxLength) : undefined].filter(Boolean).join('. ') || undefined}
          accessibilityState={{ disabled: !!disabled }}
          testID={testID}
          textAlignVertical="top"
          style={{ minHeight: rows * line, maxHeight: maxRows * line, padding: 0, color: colors.text, fontSize: typography.fontSize.md, lineHeight: line, ...fontFor(theme, 'regular') }}
        />
        {maxLength !== undefined ? (
          <Text
            importantForAccessibility="no"
            accessibilityElementsHidden
            style={[textStyleFor(theme, 'caption'), { alignSelf: 'flex-end', color: text.length >= maxLength ? textTones(colors).danger : colors.textMuted, fontVariant: ['tabular-nums'] }]}
          >
            {text.length}/{maxLength}
          </Text>
        ) : null}
      </Animated.View>
    </FieldShell>
  );
}
