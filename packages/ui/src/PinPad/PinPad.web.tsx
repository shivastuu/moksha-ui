'use client';

import { useId, type KeyboardEvent } from 'react';
import { useShakeOnError } from '../motion/useShakeOnError';
import { useControllableState } from '../utils/useControllableState';
import { nextPin, pinKeys, pinStatus, type PinKey, type PinPadProps } from './PinPad.shared';

const DeleteIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7 6-7Z" />
    <path d="m12 9.5 5 5m0-5-5 5" />
  </svg>
);

/** A PIN entry: dots that pop as digits land, and a round keypad. Typing digits and Backspace work too */
export function PinPad({ label, length = 4, value, defaultValue = '', onValueChange, onComplete, error, testID }: PinPadProps) {
  const [pin, setPin] = useControllableState(value, defaultValue, onValueChange);
  const [shaking, shakeDone] = useShakeOnError(error);
  const id = useId();

  const press = (key: PinKey) => {
    const next = nextPin(pin, key, length);
    if (next === pin) {
      return;
    }
    setPin(next);
    if (key !== 'delete' && next.length === length) {
      onComplete?.(next);
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const key = event.key === 'Backspace' ? 'delete' : /^\d$/.test(event.key) ? (event.key as PinKey) : null;
    if (key) {
      event.preventDefault();
      press(key);
    }
  };

  return (
    <div className={`ds-pin${error ? ' ds-pin--invalid' : ''}`} role="group" aria-labelledby={id} onKeyDown={onKeyDown} data-testid={testID}>
      <p id={id} className="ds-pin__label">
        {label}
      </p>
      <div className={`ds-pin__dots${shaking ? ' ds-pin__dots--shake' : ''}`} aria-hidden="true" onAnimationEnd={(event) => event.animationName === 'ds-shake' && shakeDone()}>
        {Array.from({ length }, (_, index) => (
          <span key={index} className="ds-pin__dot" data-filled={index < pin.length || undefined} />
        ))}
      </div>
      <p className="ds-pin__message" aria-hidden="true">
        {error}
      </p>
      <span className="ds-visually-hidden" role="status">
        {error ?? pinStatus(pin.length, length)}
      </span>
      <div className="ds-pin__keys">
        {pinKeys.map((key) =>
          key === '' ? (
            <span key="blank" />
          ) : (
            <button
              key={key}
              type="button"
              className={`ds-pin__key${key === 'delete' ? ' ds-pin__key--delete' : ''}`}
              aria-label={key === 'delete' ? 'Delete' : undefined}
              onClick={() => press(key)}
            >
              {key === 'delete' ? <DeleteIcon /> : key}
            </button>
          )
        )}
      </div>
    </div>
  );
}
