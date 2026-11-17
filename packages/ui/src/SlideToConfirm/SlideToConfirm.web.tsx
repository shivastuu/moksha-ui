'use client';

import { useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { CheckIcon } from '../Icon/CheckIcon.web';
import { ChevronIcon } from '../Icon/ChevronIcon.web';
import { Spinner } from '../Spinner/Spinner.web';
import { clampOffset, slide, type SlideState, type SlideToConfirmProps } from './SlideToConfirm.shared';

/**
 * Slide the knob to the end to confirm, like "Slide to pay". It fires only when released past 90%, so a slip
 * doesn't pay. Keyboard (Enter or Space) and screen readers confirm directly
 */
export function SlideToConfirm({ label, onConfirm, pendingLabel = 'Processing', doneLabel = 'Done', disabled, testID }: SlideToConfirmProps) {
  const [state, setState] = useState<SlideState>('idle');
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const grabbedAt = useRef(0);
  const travel = () => (track.current ? track.current.clientWidth - slide.knob - slide.inset * 2 : 0);
  const ready = state === 'idle' && !disabled;

  const confirm = async () => {
    if (!ready) {
      return;
    }
    setOffset(travel());
    setState('pending');
    try {
      await onConfirm();
      setState('done');
    } catch {
      // Fail closed: back to the start, never "Done"
      setOffset(0);
      setState('idle');
    }
  };

  const grab = (event: PointerEvent<HTMLSpanElement>) => {
    if (!ready) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    grabbedAt.current = event.clientX - offset;
    setDragging(true);
  };
  const drag = (event: PointerEvent<HTMLSpanElement>) => dragging && setOffset(clampOffset(event.clientX - grabbedAt.current, travel()));
  const release = () => {
    if (!dragging) {
      return;
    }
    setDragging(false);
    if (offset >= travel() * slide.threshold) {
      void confirm();
    } else {
      setOffset(0);
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      void confirm();
    }
  };
  // Screen readers activate with a click that has no pointer behind it (detail 0); mouse clicks must slide
  const onClick = (event: MouseEvent) => event.detail === 0 && void confirm();

  const text = state === 'done' ? doneLabel : state === 'pending' ? pendingLabel : label;
  const length = travel();
  return (
    <div
      ref={track}
      className="ds-slide"
      role="button"
      tabIndex={ready ? 0 : -1}
      aria-label={text}
      aria-disabled={!ready || undefined}
      aria-busy={state === 'pending' || undefined}
      data-state={state}
      data-dragging={dragging || undefined}
      onKeyDown={onKeyDown}
      onClick={onClick}
      data-testid={testID}
      style={{ '--ds-slide-offset': `${offset}px`, '--ds-slide-progress': length ? offset / length : 0 } as CSSProperties}
    >
      <span className="ds-slide__fill" aria-hidden="true" />
      <span className="ds-slide__label" aria-hidden="true">
        {text}
      </span>
      <span className="ds-slide__knob" aria-hidden="true" onPointerDown={grab} onPointerMove={drag} onPointerUp={release} onPointerCancel={release}>
        {state === 'done' ? (
          <CheckIcon />
        ) : state === 'pending' ? (
          <Spinner size="sm" tone="current" label={pendingLabel} />
        ) : (
          <span className="ds-slide__chevrons">
            <ChevronIcon />
            <ChevronIcon />
          </span>
        )}
      </span>
    </div>
  );
}
