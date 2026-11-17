'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronIcon } from '../Icon/ChevronIcon.web';
import { addMonths, compareDays, dayText, inRange, monthGrid, monthIndex, monthNames, moveDay, sameDay, spokenDay, weekdayNames, type Day } from './DatePicker.shared';

interface CalendarProps {
  selected?: Day;
  start: Day;
  today: Day;
  min?: Day;
  max?: Day;
  weekStartsOn: 0 | 1;
  onPick: (day: Day) => void;
}

/** A month grid with the WAI-ARIA date grid keys: arrows, Page Up/Down for months, Home/End for the week */
export function Calendar({ selected, start, today, min, max, weekStartsOn, onPick }: CalendarProps) {
  const [focus, setFocus] = useState(start);
  const [direction, setDirection] = useState<'next' | 'previous'>();
  const grid = useRef<HTMLTableElement>(null);
  const titleId = useId();
  const weekdays = Array.from({ length: 7 }, (_, index) => weekdayNames[(index + weekStartsOn) % 7]!);
  const days = monthGrid(focus.year, focus.month, weekStartsOn);

  // Runs after the popover's own focus handling, so the grid's day wins
  useEffect(() => {
    grid.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus();
  }, [focus]);

  const go = (next: Day) => {
    if (next.year !== focus.year || next.month !== focus.month) {
      setDirection(compareDays(next, focus) > 0 ? 'next' : 'previous');
    }
    setFocus(next);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const next = moveDay(event.key, focus, weekStartsOn);
    if (next) {
      event.preventDefault();
      go(next);
    }
  };

  return (
    <div className="ds-calendar">
      <div className="ds-calendar__header">
        <button type="button" className="ds-calendar__nav" aria-label="Previous month" disabled={!!min && monthIndex(focus) <= monthIndex(min)} onClick={() => go(addMonths(focus, -1))}>
          <ChevronIcon direction="left" />
        </button>
        <span id={titleId} className="ds-calendar__title" aria-live="polite">
          {monthNames[focus.month - 1]} {focus.year}
        </span>
        <button
          type="button"
          className="ds-calendar__nav"
          aria-label="Next month"
          disabled={!!max && monthIndex(focus) >= monthIndex(max)}
          onClick={() => go(addMonths(focus, 1))}
        >
          <ChevronIcon direction="right" />
        </button>
      </div>
      <table ref={grid} className="ds-calendar__grid" role="grid" aria-labelledby={titleId} onKeyDown={onKeyDown}>
        <thead>
          <tr>
            {weekdays.map((name) => (
              <th key={name} scope="col" abbr={name} className="ds-calendar__weekday">
                {name.slice(0, 2)}
              </th>
            ))}
          </tr>
        </thead>
        {/* Keyed by month so the new month slides in from the side it came from */}
        <tbody key={`${focus.year}-${focus.month}`} className="ds-calendar__body" data-direction={direction}>
          {Array.from({ length: 6 }, (_, week) => (
            <tr key={week}>
              {days.slice(week * 7, week * 7 + 7).map((day) => {
                const enabled = inRange(day, min, max);
                const chosen = sameDay(day, selected);
                return (
                  <td key={dayText(day)} aria-selected={chosen}>
                    <button
                      type="button"
                      className="ds-calendar__day"
                      tabIndex={sameDay(day, focus) ? 0 : -1}
                      aria-label={spokenDay(day)}
                      aria-current={sameDay(day, today) ? 'date' : undefined}
                      aria-disabled={!enabled || undefined}
                      data-outside={day.month !== focus.month || undefined}
                      data-selected={chosen || undefined}
                      onClick={() => {
                        setFocus(day);
                        if (enabled) {
                          onPick(day);
                        }
                      }}
                    >
                      {day.day}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
