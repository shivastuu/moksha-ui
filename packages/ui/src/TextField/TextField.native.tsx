import { useState, type ReactNode } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';
import { useTheme } from '../theme/context';
import { fontFor } from '../theme/textStyle';
import { useControllableState } from '../utils/useControllableState';
import { FieldShell } from './FieldShell.native';
import { clampRaw, identity, type AutoComplete, type TextFieldProps } from './TextField.shared';

const nativeAutoComplete = (value?: AutoComplete) =>
  value === 'one-time-code' && Platform.OS === 'android' ? 'sms-otp' : value;

export function TextField({
  label,
  hideLabel,
  value,
  defaultValue = '',
  onChangeText,
  placeholder,
  helperText,
  error,
  disabled,
  readOnly,
  required,
  prefix,
  suffix,
  variant = 'outline',
  size = 'md',
  inputMode = 'text',
  autoComplete,
  maxLength,
  secureTextEntry,
  clearable,
  allowPaste = true,
  format = identity,
  parse = identity,
  onFocus,
  onBlur,
  onSubmitEditing,
  autoFocus,
  testID,
}: TextFieldProps) {
  const theme = useTheme();
  const { colors, components, glass, blurView: BlurView, scheme } = theme;
  const { field } = components;
  const metrics = field.sizes[size];
  const [raw, setRaw] = useControllableState(value, defaultValue, onChangeText);
  const [focused, setFocused] = useState(false);
  const editable = !disabled && !readOnly;
  const isGlass = variant === 'glass';
  const accent = error ? colors.danger : colors.primary;
  const restingBorder =
    variant === 'filled' ? 'transparent' : isGlass ? colors.glassBorder : colors.border;
  const background =
    variant === 'filled'
      ? colors.surface
      : isGlass
        ? BlurView
          ? colors.glassSurface
          : colors.surfaceRaised
        : colors.background;
  const text = { fontSize: metrics.fontSize, ...fontFor(theme, 'regular') };
  const controlTestID = testID ? `${testID}-control` : undefined;

  const affix = (node: ReactNode) =>
    typeof node === 'string' ? <Text style={[text, { color: colors.textMuted }]}>{node}</Text> : node;

  const controlStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: field.gap,
    minHeight: metrics.height,
    paddingHorizontal: metrics.paddingX,
    borderRadius: field.radius,
    borderWidth: field.borderWidth,
    borderColor: error || focused ? accent : restingBorder,
    backgroundColor: background,
    boxShadow: focused ? `0px 0px 0px ${field.borderWidth}px ${accent}` : undefined,
    overflow: isGlass ? ('hidden' as const) : undefined,
  };

  const content = (
    <>
      {prefix !== undefined && affix(prefix)}
      <TextInput
        value={format(raw)}
        onChangeText={(next) => setRaw(clampRaw(next, parse, maxLength))}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        editable={editable}
        autoFocus={autoFocus}
        inputMode={inputMode}
        autoComplete={nativeAutoComplete(autoComplete)}
        secureTextEntry={secureTextEntry}
        contextMenuHidden={!allowPaste}
        returnKeyType={inputMode === 'search' ? 'search' : undefined}
        onSubmitEditing={onSubmitEditing}
        onFocus={() => {
          setFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        accessibilityLabel={label}
        accessibilityHint={error ?? helperText}
        accessibilityState={{ disabled: !!disabled }}
        testID={testID}
        style={[text, { flex: 1, alignSelf: 'stretch', padding: 0, color: colors.text }]}
      />
      {clearable && raw && editable ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Clear ${label}`}
          hitSlop={field.gap}
          onPress={() => setRaw('')}
        >
          <Text style={[text, { color: colors.textMuted }]}>×</Text>
        </Pressable>
      ) : null}
      {suffix !== undefined && affix(suffix)}
    </>
  );

  return (
    <FieldShell
      label={label}
      hideLabel={hideLabel}
      required={required}
      message={error ?? helperText}
      invalid={!!error}
      disabled={disabled}
    >
      {isGlass && BlurView ? (
        <BlurView
          intensity={Math.min(100, glass.blur.sm * 2)}
          tint={scheme}
          style={controlStyle}
          testID={controlTestID}
        >
          {content}
        </BlurView>
      ) : (
        <View style={controlStyle} testID={controlTestID}>
          {content}
        </View>
      )}
    </FieldShell>
  );
}
