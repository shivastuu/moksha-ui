'use client';

import { useId, useImperativeHandle, useRef, useState } from 'react';
import { useShakeOnError } from '../motion/useShakeOnError';
import { FieldShell } from '../TextField/FieldShell.web';
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
  ref,
}: OtpFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? helperText;
  const { code, change, cells, activeIndex } = useOtp({ length, value, defaultValue, onChangeText, onComplete });
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }), []);
  const [shaking, shakeDone] = useShakeOnError(error);

  return (
    <FieldShell
      inputId={id}
      messageId={messageId}
      label={label}
      hideLabel={hideLabel}
      message={message}
      invalid={!!error}
      disabled={disabled}
    >
      <div
        className={shaking ? 'ds-otp ds-otp--shake' : 'ds-otp'}
        onAnimationEnd={(event) => event.animationName === 'ds-shake' && shakeDone()}
      >
        {cells.map((digit, index) => (
          <div
            key={index}
            aria-hidden="true"
            className={focused && index === activeIndex ? 'ds-otp__cell ds-otp__cell--active' : 'ds-otp__cell'}
          >
            {digit && <span className="ds-otp__digit">{masked ? '•' : digit}</span>}
          </div>
        ))}
        <input
          ref={inputRef}
          id={id}
          className="ds-otp__input"
          value={code}
          onChange={(event) => change(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          type={masked ? 'password' : 'text'}
          inputMode="numeric"
          autoComplete="one-time-code"
          disabled={disabled}
          autoFocus={autoFocus}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          data-testid={testID}
        />
      </div>
    </FieldShell>
  );
}
