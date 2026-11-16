import { useImperativeHandle, useRef, useState, type ComponentRef } from 'react';
import { Animated, Platform, Pressable, TextInput } from 'react-native';
import { usePop, useShake } from '../motion/nativeMotion.native';
import { useShakeOnError } from '../motion/useShakeOnError';
import { useTheme } from '../theme/context';
import { fontFor } from '../theme/textStyle';
import { FieldShell } from '../TextField/FieldShell.native';
import { useOtp, type OtpFieldProps } from './OtpField.shared';

interface OtpCellProps {
  digit: string;
  masked?: boolean;
  active: boolean;
  error?: string;
  testID?: string;
}

function OtpCell({ digit, masked, active, error, testID }: OtpCellProps) {
  const theme = useTheme();
  const { colors, components } = theme;
  const { otp, field } = components;
  const scale = usePop(digit);
  const accent = error ? colors.danger : colors.primary;

  return (
    <Animated.View
      testID={testID}
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
      <Animated.Text
        style={{
          color: colors.text,
          fontSize: otp.fontSize,
          ...fontFor(theme, 'semibold'),
          transform: [{ scale }],
        }}
      >
        {digit && (masked ? '•' : digit)}
      </Animated.Text>
    </Animated.View>
  );
}

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
  ref,
}: OtpFieldProps) {
  const { otp } = useTheme().components;
  const { code, change, cells, activeIndex } = useOtp({ length, value, defaultValue, onChangeText, onComplete });
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }), []);
  const [shaking, shakeDone] = useShakeOnError(error);
  const shakeX = useShake(shaking, shakeDone);

  return (
    <FieldShell
      label={label}
      hideLabel={hideLabel}
      message={error ?? helperText}
      invalid={!!error}
      disabled={disabled}
    >
      <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
        <Pressable
          accessible={false}
          onPress={() => inputRef.current?.focus()}
          style={{ flexDirection: 'row', gap: otp.gap, alignSelf: 'flex-start' }}
        >
          {cells.map((digit, index) => (
            <OtpCell
              key={index}
              digit={digit}
              masked={masked}
              active={focused && index === activeIndex}
              error={error}
              testID={testID ? `${testID}-cell-${index}` : undefined}
            />
          ))}
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
      </Animated.View>
    </FieldShell>
  );
}
