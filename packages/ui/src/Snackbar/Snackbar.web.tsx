'use client';

import { Motion } from '../motion/Motion.web';
import { createSnackbarProvider, type SnackbarViewProps } from './Snackbar.shared';

function SnackbarView({ snackbar, onAction, onPause, onResume }: SnackbarViewProps) {
  return (
    // The live region stays in the page, so screen readers announce each new message
    <div className="ds-snackbar-region" role="status" aria-live="polite">
      {snackbar && (
        <Motion key={snackbar.id} preset="slideUp" spring="snappy">
          <div
            className="ds-snackbar"
            onMouseEnter={onPause}
            onMouseLeave={onResume}
            onFocus={onPause}
            onBlur={onResume}
          >
            <span className="ds-snackbar__message">{snackbar.message}</span>
            {snackbar.action && (
              <button type="button" className="ds-snackbar__action ds-press ds-press--object" onClick={onAction}>
                {snackbar.action.label}
              </button>
            )}
          </div>
        </Motion>
      )}
    </div>
  );
}

/** Put it once near the root, inside ThemeProvider, then call `useSnackbar().show(...)` anywhere below */
export const SnackbarProvider = createSnackbarProvider(SnackbarView);
