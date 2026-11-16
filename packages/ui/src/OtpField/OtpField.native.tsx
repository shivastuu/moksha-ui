import { useRef, useState, type ComponentRef } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';
import { useTheme } from '../theme/context';
import { fontFor } from '../theme/textStyle';
import { FieldShell } from '../TextField/FieldShell.native';
import { useOtp, type OtpFieldProps } from './OtpField.shared';

export function OtpField({
  label,
  hideLabel,
  length = 6,
  value,
  defaultValue,
  onChangeText,
  onComplete,
  masked,
  helperText,
  error,
  disabled,
  autoFocus,
  testID,
}: OtpFieldProps) {
  const theme = useTheme();
  const { colors, components } = theme;
  const { otp, field } = components;
  const { code, change, cells, activeIndex } = useOtp({ length, value, defaultValue, onChangeText, onComplete });
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const accent = error ? colors.danger : colors.primary;

  return (
    <FieldShell
      label={label}
      hideLabel={hideLabel}
      message={error ?? helperText}
      invalid={!!error}
      disabled={disabled}
    >
      <Pressable
        accessible={false}
        onPress={() => inputRef.current?.focus()}
        style={{ flexDirection: 'row', gap: otp.gap, alignSelf: 'flex-start' }}
      >
        {cells.map((digit, index) => {
          const active = focused && index === activeIndex;
          return (
            <View
              key={index}
              testID={testID ? `${testID}-cell-${index}` : undefined}
              style={{
                width: otp.cellSize,
                height: otp.cellSize,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: otp.radius,
                borderWidth: field.borderWidth,
                borderColor: error || active ? accent : colors.border,
                backgroundColor: colors.background,
                boxShadow: active ? `0px 0px 0px ${field.borderWidth}px ${accent}` : undefined,
              }}
            >
              <Text style={{ color: colors.text, fontSize: otp.fontSize, ...fontFor(theme, 'semibold') }}>
                {digit && (masked ? '•' : digit)}
              </Text>
            </View>
          );
        })}
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={change}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          inputMode="numeric"
          textContentType="oneTimeCode"
          autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
          secureTextEntry={masked}
          editable={!disabled}
          autoFocus={autoFocus}
          caretHidden
          accessibilityLabel={label}
          accessibilityHint={error ?? helperText}
          testID={testID}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, opacity: 0 }}
        />
      </Pressable>
    </FieldShell>
  );
}
