'use client';

import { useId, type CSSProperties } from 'react';
import { useControllableState } from '../utils/useControllableState';
import { fractionOf, type SliderProps } from './Slider.shared';

/** A restyled native range input: brand fill, a thumb that swells while held, and the value beside the label */
export function Slider({ label, value, defaultValue, onValueChange, min = 0, max = 100, step = 1, format = String, disabled, testID }: SliderProps) {
  const [current, setCurrent] = useControllableState(value, defaultValue ?? min, onValueChange);
  const id = useId();
  return (
    <div className={`ds-slider${disabled ? ' ds-slider--disabled' : ''}`}>
      <div className="ds-slider__header">
        <label htmlFor={id} className="ds-slider__label">
          {label}
        </label>
        <output htmlFor={id} className="ds-slider__value" aria-hidden="true">
          {format(current)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        className="ds-slider__input"
        min={min}
        max={max}
        step={step}
        value={current}
        disabled={disabled}
        aria-valuetext={format(current)}
        onChange={(event) => setCurrent(Number(event.target.value))}
        style={{ '--ds-slider-fill': `${fractionOf(current, min, max) * 100}%` } as CSSProperties}
        data-testid={testID}
      />
      <div className="ds-slider__scale" aria-hidden="true">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}
