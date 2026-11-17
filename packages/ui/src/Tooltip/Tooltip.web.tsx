'use client';

import { useEffect, useRef, useState } from 'react';
import { Floating } from '../Popover/Floating.web';
import { tooltipTiming, type TooltipProps } from './Tooltip.shared';

/** A dark hint above a control: after a short hover, at once on keyboard focus. Escape hides it */
export function Tooltip({ label, children, side = 'top', testID }: TooltipProps) {
  const anchor = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const show = (delay: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <span
      ref={anchor}
      className="ds-tooltip-anchor"
      onPointerEnter={(event) => event.pointerType === 'mouse' && show(tooltipTiming.hover)}
      onPointerLeave={hide}
      onFocus={() => show(0)}
      onBlur={hide}
    >
      {children}
      <Floating anchor={anchor} open={open} onClose={hide} side={side} align="center" className="ds-tooltip" takeFocus={false} decorative testID={testID}>
        {label}
      </Floating>
    </span>
  );
}
