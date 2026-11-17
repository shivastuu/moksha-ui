'use client';

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { placeFloating, type FloatingAlign, type FloatingSide } from '../utils/floating';
import type { Anchor } from './Popover.shared';

const focusable = 'button:not([disabled]),[href],input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

/** Puts focus back on the trigger inside the anchor, after Escape or a choice */
export function focusAnchor(anchor: Anchor) {
  const element = anchor.current as HTMLElement | null;
  (element?.querySelector<HTMLElement>(focusable) ?? element)?.focus();
}

interface FloatingProps {
  anchor: Anchor;
  open: boolean;
  onClose: () => void;
  side?: FloatingSide;
  align?: FloatingAlign;
  role?: 'dialog' | 'menu';
  label?: string;
  className: string;
  /** Moves focus into the panel when it opens */
  takeFocus?: boolean;
  /** Visual only, like a tooltip that repeats the control's name */
  decorative?: boolean;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  testID?: string;
  children: ReactNode;
}

/**
 * A panel in the browser's top layer (popover="manual"), so no overflow can clip it, placed next to its anchor
 * and kept on screen as the page scrolls. Escape and a press outside close it
 */
export function Floating({ anchor, open, onClose, side = 'bottom', align = 'start', role, label, className, takeFocus = true, decorative, onKeyDown, testID, children }: FloatingProps) {
  const panel = useRef<HTMLDivElement>(null);
  const [place, setPlace] = useState<ReturnType<typeof placeFloating>>();
  const close = useRef(onClose);
  close.current = onClose;

  useLayoutEffect(() => {
    const element = panel.current;
    if (!open || !element) {
      setPlace(undefined);
      return;
    }
    element.showPopover?.();
    const update = () => {
      const box = (anchor.current as HTMLElement | null)?.getBoundingClientRect();
      if (box) {
        setPlace(placeFloating(box, { width: element.offsetWidth, height: element.offsetHeight }, { width: window.innerWidth, height: window.innerHeight }, side, align));
      }
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    if (takeFocus) {
      (element.querySelector<HTMLElement>(focusable) ?? element).focus({ preventScroll: true });
    }
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchor, side, align, takeFocus]);

  // Our own light dismiss: a press on the trigger itself is left to the trigger, so it toggles instead of reopening
  useEffect(() => {
    if (!open) {
      return;
    }
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panel.current?.contains(target) && !(anchor.current as HTMLElement | null)?.contains(target)) {
        close.current();
      }
    };
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        close.current();
        focusAnchor(anchor);
      }
    };
    document.addEventListener('pointerdown', outside, true);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside, true);
      document.removeEventListener('keydown', escape);
    };
  }, [open, anchor]);

  if (!open) {
    return null;
  }
  return (
    <div
      ref={panel}
      popover="manual"
      role={decorative ? undefined : role}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      tabIndex={takeFocus ? -1 : undefined}
      className={`ds-floating ${className}`}
      data-side={place?.side}
      onKeyDown={onKeyDown}
      data-testid={testID}
      // Transparent, not hidden, until placed: a hidden element can't take focus
      style={{ top: place?.y ?? 0, left: place?.x ?? 0, opacity: place ? undefined : 0 }}
    >
      {children}
    </div>
  );
}
