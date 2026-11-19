export const resendCss = `
.ds-resend{display:inline-flex;align-items:center;gap:0.3em;padding:var(--ds-space-xs) 0;border:0;background:transparent;color:var(--ds-text-tone-primary);font:inherit;font-family:var(--ds-font-sans);font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm);font-weight:var(--ds-font-weight-medium);cursor:pointer;text-decoration-line:underline;text-decoration-thickness:1px;text-underline-offset:0.22em;text-decoration-color:transparent;transition:text-decoration-color var(--ds-duration-fast) var(--ds-easing-standard),color var(--ds-duration-fast) var(--ds-easing-standard)}
@media (hover:hover){.ds-resend:hover:not([aria-disabled=true]){text-decoration-color:currentColor}}
.ds-resend[aria-disabled=true]{color:var(--ds-color-text-muted);cursor:default}
.ds-resend__clock{min-width:2.6em;color:var(--ds-color-text);font-variant-numeric:tabular-nums;text-align:start}
.ds-resend:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset);border-radius:var(--ds-radius-sm)}
@media (prefers-reduced-motion:reduce){.ds-resend{transition:none}}
`;
