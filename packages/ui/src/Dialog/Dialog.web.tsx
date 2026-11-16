'use client';

import { useEffect, useId, useRef } from 'react';
import type { BottomSheetProps, DialogProps } from './Dialog.shared';

/**
 * A modal dialog on the native `<dialog>` element, which traps focus, closes on Escape,
 * makes the page behind it inert and puts focus back where it was
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  actions,
  presentation = 'auto',
  dismissible = true,
  testID,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog?.open) {
      dialog?.showModal();
    } else if (!open && dialog?.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`ds-dialog ds-dialog--${presentation}`}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (dismissible) {
          onClose();
        }
      }}
      // The browser can still force it shut (a second Escape); keep `open` in sync when it does
      onClose={() => open && onClose()}
      onClick={(event) => {
        // A click on the dialog box itself, not on the panel inside it, is a click on the backdrop
        if (dismissible && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {open && (
        <div className="ds-dialog__panel" data-testid={testID}>
          <div className="ds-dialog__handle" aria-hidden="true" />
          <h2 id={titleId} className="ds-dialog__title">
            {title}
          </h2>
          {children !== undefined && <div className="ds-dialog__content">{children}</div>}
          {actions !== undefined && <div className="ds-dialog__actions">{actions}</div>}
        </div>
      )}
    </dialog>
  );
}

/** A panel that slides up from the bottom of the screen */
export function BottomSheet(props: BottomSheetProps) {
  return <Dialog {...props} presentation="sheet" />;
}
