'use client';

import { useId, useState } from 'react';
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
}: OtpFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? helperText;
  const { code, change, cells, activeIndex } = useOtp({ length, value, defaultValue, onChangeText, onComplete });
  const [focused, setFocused] = useState(false);

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
      <div className="ds-otp">
        {cells.map((digit, index) => (
          <div
            key={index}
            aria-hidden="true"
            className={focused && index === activeIndex ? 'ds-otp__cell ds-otp__cell--active' : 'ds-otp__cell'}
          >
            {digit && (masked ? '•' : digit)}
          </div>
        ))}
        <input
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
