import { useImperativeHandle, useRef, useState, type ComponentRef, type ReactNode } from 'react';
import { Animated, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { useShake } from '../motion/nativeMotion.native';
import { useShakeOnError } from '../motion/useShakeOnError';
import { useTheme } from '../theme/context';
import { fontFor } from '../theme/textStyle';
import { useControllableState } from '../utils/useControllableState';
import { FieldShell } from './FieldShell.native';
import { clampRaw, fieldColors, identity, type AutoComplete, type TextFieldProps } from './TextField.shared';

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
  returnKeyType,
  autoFocus,
  testID,
  ref,
}: TextFieldProps) {
  const theme = useTheme();
  const { colors, components, glass, blurView: BlurView, scheme } = theme;
  const { field } = components;
  const metrics = field.sizes[size];
  const [raw, setRaw] = useControllableState(value, defaultValue, onChangeText);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }), []);
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
  const [shaking, shakeDone] = useShakeOnError(error);
  const shakeX = useShake(shaking, shakeDone);

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
    // A soft halo while focused, a whisper of depth at rest
    boxShadow: focused ? `0px 0px 0px ${field.halo}px ${fieldColors(colors)[error ? 'haloDanger' : 'halo']}` : disabled ? undefined : theme.shadows.sm,
    overflow: isGlass ? ('hidden' as const) : undefined,
  };

  const content = (
    <>
      {prefix !== undefined && affix(prefix)}
      <TextInput
        ref={inputRef}
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
        returnKeyType={returnKeyType ?? (inputMode === 'search' ? 'search' : undefined)}
        // "Next" keeps the keyboard up while focus moves on, so it doesn't drop and rise between fields
        submitBehavior={returnKeyType === 'next' ? 'submit' : undefined}
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
      <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
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
      </Animated.View>
    </FieldShell>
  );
}
