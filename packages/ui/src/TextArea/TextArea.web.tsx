'use client';

import { useId, type CSSProperties } from 'react';
import { useShakeOnError } from '../motion/useShakeOnError';
import { FieldShell } from '../TextField/FieldShell.web';
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
  const [text, setText] = useControllableState(value, defaultValue, onChangeText);
  const [shaking, shakeDone] = useShakeOnError(error);
  const id = useId();
  const message = error ?? helperText;
  const described = [message && `${id}-message`, maxLength !== undefined && `${id}-count`].filter(Boolean).join(' ');

  return (
    <FieldShell inputId={id} messageId={`${id}-message`} label={label} hideLabel={hideLabel} required={required} message={message} invalid={!!error} disabled={disabled}>
      <div
        className={`ds-field__control ds-field__control--outline ds-textarea${shaking ? ' ds-field__control--shake' : ''}`}
        style={{ '--ds-textarea-rows': rows, '--ds-textarea-max-rows': maxRows } as CSSProperties}
        onAnimationEnd={(event) => event.animationName === 'ds-shake' && shakeDone()}
      >
        <textarea
          id={id}
          className="ds-field__input ds-textarea__input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={described || undefined}
          data-testid={testID}
        />
        {maxLength !== undefined && (
          <span className="ds-textarea__count" data-full={text.length >= maxLength || undefined}>
            <span aria-hidden="true">
              {text.length}/{maxLength}
            </span>
            <span id={`${id}-count`} className="ds-visually-hidden">
              {countLabel(text.length, maxLength)}
            </span>
          </span>
        )}
      </div>
    </FieldShell>
  );
}
