import { useEffect, useImperativeHandle, useRef, useState, type ComponentRef } from 'react';
import { Animated, Platform, Pressable, TextInput } from 'react-native';
import { usePop, useShake } from '../motion/nativeMotion.native';
import { useReducedMotion } from '../motion/useReducedMotion.native';
import { useShakeOnError } from '../motion/useShakeOnError';
import { useTheme } from '../theme/context';
import { fontFor } from '../theme/textStyle';
import { FieldShell } from '../TextField/FieldShell.native';
import { fieldColors } from '../TextField/TextField.shared';
import { useOtp, type OtpFieldProps } from './OtpField.shared';

interface OtpCellProps {
  digit: string;
  masked?: boolean;
  active: boolean;
  error?: string;
  testID?: string;
}

/** A blinking bar in the empty cell that takes the next digit. Solid with Reduce Motion */
function Caret({ color, height, testID }: { color: string; height: number; testID?: string }) {
  const reduced = useReducedMotion();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reduced !== false) {
      return;
    }
    const step = (toValue: number) => Animated.timing(opacity, { toValue, duration: 0, delay: 550, useNativeDriver: true });
    const blink = Animated.loop(Animated.sequence([step(0), step(1)]));
    blink.start();
    return () => {
      blink.stop();
      opacity.setValue(1);
    };
  }, [reduced, opacity]);

  return <Animated.View testID={testID} style={{ width: 2, height, borderRadius: 1, backgroundColor: color, opacity }} />;
}

function OtpCell({ digit, masked, active, error, testID }: OtpCellProps) {
  const theme = useTheme();
  const { colors, components, shadows } = theme;
  const { otp, field } = components;
  const scale = usePop(digit);
  const accent = error ? colors.danger : colors.primary;
  const halo = fieldColors(colors)[error ? 'haloDanger' : 'halo'];

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
        boxShadow: active ? `0px 0px 0px ${field.halo}px ${halo}` : shadows.sm,
      }}
    >
      {active && !digit ? <Caret color={accent} height={otp.cellSize * 0.38} testID={testID ? `${testID}-caret` : undefined} /> : null}
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
