'use client';

import { useRef, type KeyboardEvent } from 'react';
import { Floating, focusAnchor } from '../Popover/Floating.web';
import { nextEnabled, type MenuProps } from './Menu.shared';

/** A list of actions that opens from a trigger. Arrow keys, Home and End move; Enter chooses; Escape closes */
export function Menu({ anchor, open, onClose, accessibilityLabel, items, side, align = 'end', testID }: MenuProps) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent) => {
    const current = buttons.current.indexOf(document.activeElement as HTMLButtonElement);
    const target = {
      ArrowDown: nextEnabled(items, current, 1),
      ArrowUp: nextEnabled(items, current < 0 ? 0 : current, -1),
      Home: nextEnabled(items, -1, 1),
      End: nextEnabled(items, items.length, -1),
    }[event.key];
    if (target !== undefined) {
      event.preventDefault();
      buttons.current[target]?.focus();
    } else if (event.key === 'Tab') {
      onClose();
    }
  };

  return (
    <Floating anchor={anchor} open={open} onClose={onClose} side={side} align={align} role="menu" label={accessibilityLabel} className="ds-menu" onKeyDown={onKeyDown} testID={testID}>
      {items.map((item, index) => (
        <button
          key={item.label}
          ref={(element) => {
            buttons.current[index] = element;
          }}
          type="button"
          role="menuitem"
          tabIndex={-1}
          className="ds-menu__item ds-press"
          data-tone={item.tone}
          disabled={item.disabled}
          onClick={() => {
            onClose();
            focusAnchor(anchor);
            item.onSelect();
          }}
        >
          {item.icon && (
            <span className="ds-menu__icon" aria-hidden="true">
              {item.icon}
            </span>
          )}
          {item.label}
        </button>
      ))}
    </Floating>
  );
}
