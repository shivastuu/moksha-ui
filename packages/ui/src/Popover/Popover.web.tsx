'use client';

import { Floating } from './Floating.web';
import type { PopoverProps } from './Popover.shared';

/** A small panel that opens from a trigger: details, a quick form, a confirmation. Focus moves into it */
export function Popover({ anchor, open, onClose, accessibilityLabel, children, side, align, testID }: PopoverProps) {
  return (
    <Floating anchor={anchor} open={open} onClose={onClose} side={side} align={align} role="dialog" label={accessibilityLabel} className="ds-popover" testID={testID}>
      {children}
    </Floating>
  );
}
