'use client';

import { useId, useLayoutEffect, useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { useShakeOnError } from '../motion/useShakeOnError';
import { useControllableState } from '../utils/useControllableState';
import { FieldShell } from './FieldShell.web';
import { clampRaw, identity, type InputMode, type TextFieldProps } from './TextField.shared';

const inputType = (inputMode: InputMode, secure?: boolean) => {
  if (secure) {
    return 'password';
  }
  if (inputMode === 'email' || inputMode === 'search' || inputMode === 'tel' || inputMode === 'url') {
    return inputMode;
  }
  return 'text';
};

/** Index in `display` right after `rawCount` characters of the raw value */
function caretIndex(display: string, rawCount: number, parse: (text: string) => string) {
  if (rawCount <= 0) {
    return 0;
  }
  for (let index = 1; index <= display.length; index += 1) {
    if (parse(display.slice(0, index)).length >= rawCount) {
      return index;
    }
  }
  return display.length;
}

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
  const [raw, setRaw] = useControllableState(value, defaultValue, onChangeText);
  const id = useId();
  const messageId = `${id}-message`;
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCaret = useRef<number | null>(null);
  const display = format(raw);
  const message = error ?? helperText;
  const [shaking, shakeDone] = useShakeOnError(error);

  useLayoutEffect(() => {
    if (pendingCaret.current === null || !inputRef.current) {
      return;
    }
    const position = caretIndex(display, pendingCaret.current, parse);
    inputRef.current.setSelectionRange(position, position);
    pendingCaret.current = null;
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    const next = clampRaw(text, parse, maxLength);
    const caret = event.target.selectionStart ?? text.length;
    pendingCaret.current = Math.min(parse(text.slice(0, caret)).length, next.length);
    setRaw(next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmitEditing?.();
    }
  };

  const clear = () => {
    setRaw('');
    inputRef.current?.focus();
  };

  return (
    <FieldShell
      inputId={id}
      messageId={messageId}
      label={label}
      hideLabel={hideLabel}
      required={required}
      message={message}
      invalid={!!error}
      disabled={disabled}
      size={size}
    >
      <div
        className={`ds-field__control ds-field__control--${variant}${shaking ? ' ds-field__control--shake' : ''}`}
        onAnimationEnd={(event) => event.animationName === 'ds-shake' && shakeDone()}
        data-testid={testID ? `${testID}-control` : undefined}
      >
        {prefix !== undefined && <span className="ds-field__affix">{prefix}</span>}
        <input
          ref={inputRef}
          id={id}
          className="ds-field__input"
          value={display}
          onChange={handleChange}
          onKeyDown={onSubmitEditing ? handleKeyDown : undefined}
          onFocus={onFocus}
          onBlur={onBlur}
          onPaste={allowPaste ? undefined : (event) => event.preventDefault()}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoFocus={autoFocus}
          type={inputType(inputMode, secureTextEntry)}
          inputMode={inputMode}
          autoComplete={autoComplete}
          enterKeyHint={inputMode === 'search' ? 'search' : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          data-testid={testID}
        />
        {clearable && raw && !disabled && !readOnly && (
          <button type="button" className="ds-field__clear" aria-label={`Clear ${label}`} onClick={clear}>
            ×
          </button>
        )}
        {suffix !== undefined && <span className="ds-field__affix">{suffix}</span>}
      </div>
    </FieldShell>
  );
}
