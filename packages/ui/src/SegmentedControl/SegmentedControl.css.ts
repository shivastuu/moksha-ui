export const segmentedCss = `
.ds-segmented{--ds-segmented-inset:3px;position:relative;display:grid;box-sizing:border-box;height:var(--ds-segmented-height);padding:var(--ds-segmented-inset);border-radius:var(--ds-radius-full);background:var(--ds-control-segment-track);font-family:var(--ds-font-sans)}
.ds-segmented__indicator{position:absolute;top:var(--ds-segmented-inset);bottom:var(--ds-segmented-inset);left:var(--ds-segmented-inset);border-radius:var(--ds-radius-full);background:var(--ds-color-surface-raised);box-shadow:var(--ds-shadow-sm),0 0 0 1px var(--ds-surface-edge);transition:transform var(--ds-spring-smooth-duration) var(--ds-spring-smooth)}
.ds-segmented__option{position:relative;min-width:0;padding:0 var(--ds-space-md);border:0;border-radius:var(--ds-radius-full);background:transparent;color:var(--ds-color-text-muted);font:inherit;font-size:var(--ds-font-size-sm);font-weight:var(--ds-font-weight-medium);white-space:nowrap;cursor:pointer;transition:color var(--ds-duration-fast) var(--ds-easing-standard)}
.ds-segmented__option[aria-checked=true]{color:var(--ds-color-text)}
.ds-segmented__option:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}
@media (prefers-reduced-motion:reduce){.ds-segmented__indicator,.ds-segmented__option{transition:none}}
`;
