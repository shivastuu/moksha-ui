export const snackbarCss = `
.ds-snackbar-region{position:fixed;left:0;right:0;bottom:calc(var(--ds-snackbar-offset) + env(safe-area-inset-bottom, 0px));z-index:var(--ds-z-index-toast);display:flex;justify-content:center;padding:0 var(--ds-space-lg);pointer-events:none}
.ds-snackbar{display:flex;align-items:center;gap:var(--ds-space-lg);box-sizing:border-box;max-width:var(--ds-snackbar-max-width);padding:var(--ds-snackbar-padding) var(--ds-space-lg);border-radius:var(--ds-snackbar-radius);background:var(--ds-snackbar-fill);color:var(--ds-color-text-inverse);box-shadow:var(--ds-shadow-lg),0 0 0 1px var(--ds-snackbar-edge);-webkit-backdrop-filter:blur(16px) saturate(1.6);backdrop-filter:blur(16px) saturate(1.6);font-family:var(--ds-font-sans);font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm);pointer-events:auto}
.ds-snackbar__message{flex:1;min-width:0}
.ds-snackbar__action{flex-shrink:0;padding:var(--ds-space-xs) var(--ds-space-sm);margin:calc(var(--ds-space-xs) * -1) calc(var(--ds-space-sm) * -1);border:0;border-radius:var(--ds-radius-sm);background:transparent;color:inherit;font:inherit;font-weight:var(--ds-font-weight-semibold);cursor:pointer}
.ds-snackbar__action:focus-visible{outline:var(--ds-focus-ring-width) solid currentColor;outline-offset:var(--ds-focus-ring-offset)}
`;
