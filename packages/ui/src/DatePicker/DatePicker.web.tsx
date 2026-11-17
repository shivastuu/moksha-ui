'use client';

import { useId, useRef, useState } from 'react';
import { useShakeOnError } from '../motion/useShakeOnError';
import { focusAnchor } from '../Popover/Floating.web';
import { Popover } from '../Popover/Popover.web';
import { FieldShell } from '../TextField/FieldShell.web';
import { useControllableState } from '../utils/useControllableState';
import { Calendar } from './Calendar.web';
import { dayText, localToday, parseDay, shortDay, spokenDay, startDay, type DatePickerProps } from './DatePicker.shared';

const CalendarIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 3v3m10-3v3M4.5 9.5h15M6 5h12a1.5 1.5 0 0 1 1.5 1.5V19a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19V6.5A1.5 1.5 0 0 1 6 5Z" />
  </svg>
);

/** A date field that opens a month calendar in a popover */
export function DatePicker({ label, value, defaultValue = '', onValueChange, min, max, placeholder = 'Choose a date', helperText, error, disabled, required, weekStartsOn = 0, today, testID }: DatePickerProps) {
  const [text, setText] = useControllableState(value, defaultValue, onValueChange);
  const [open, setOpen] = useState(false);
  const [shaking, shakeDone] = useShakeOnError(error);
  const anchor = useRef<HTMLDivElement>(null);
  const id = useId();
  const selected = parseDay(text);
  const now = parseDay(today) ?? localToday();
  const [low, high] = [parseDay(min), parseDay(max)];
  const message = error ?? helperText;

  return (
    <FieldShell inputId={id} messageId={`${id}-message`} label={label} required={required} message={message} invalid={!!error} disabled={disabled}>
      <div ref={anchor} className={`ds-field__control ds-field__control--outline ds-date${shaking ? ' ds-field__control--shake' : ''}`} onAnimationEnd={(event) => event.animationName === 'ds-shake' && shakeDone()}>
        <button
          id={id}
          type="button"
          className="ds-field__input ds-date__button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-describedby={[selected && `${id}-value`, message && `${id}-message`].filter(Boolean).join(' ') || undefined}
          aria-invalid={!!error || undefined}
          disabled={disabled}
          data-empty={!selected || undefined}
          onClick={() => setOpen(!open)}
          data-testid={testID}
        >
          <span aria-hidden="true">{selected ? shortDay(selected) : placeholder}</span>
          <span id={`${id}-value`} className="ds-visually-hidden">
            {selected ? spokenDay(selected) : placeholder}
          </span>
          <CalendarIcon />
        </button>
      </div>
      <Popover anchor={anchor} open={open} onClose={() => setOpen(false)} accessibilityLabel={`Choose ${label}`} align="start">
        <Calendar
          selected={selected}
          start={startDay(selected, now, low, high)}
          today={now}
          min={low}
          max={high}
          weekStartsOn={weekStartsOn}
          onPick={(day) => {
            setText(dayText(day));
            setOpen(false);
            focusAnchor(anchor);
          }}
        />
      </Popover>
    </FieldShell>
  );
}
