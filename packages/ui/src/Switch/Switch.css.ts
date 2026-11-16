const inset = 'calc((var(--ds-switch-height) - var(--ds-switch-thumb)) / 2)';
const travel = `calc(var(--ds-switch-width) - var(--ds-switch-thumb) - 2 * ${inset})`;

// Shared by Switch, Checkbox and RadioGroup: a label and optional description beside a control
const rowCss = `
.ds-control-row{display:flex;align-items:center;justify-content:space-between;gap:var(--ds-space-lg);font-family:var(--ds-font-sans);cursor:pointer}
.ds-control-row[data-disabled]{opacity:var(--ds-opacity-disabled);cursor:not-allowed}
.ds-control-row__text{display:grid;gap:2px;min-width:0}
.ds-control-row__label{font-size:var(--ds-font-size-md);line-height:var(--ds-line-height-md);color:var(--ds-color-text)}
.ds-control-row__description{font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm);color:var(--ds-color-text-muted)}`;

export const switchCss = `${rowCss}
.ds-switch{position:relative;flex-shrink:0;width:var(--ds-switch-width);height:var(--ds-switch-height);padding:0;border:0;border-radius:var(--ds-radius-full);background:var(--ds-control-switch-off);cursor:pointer;transition:background-color var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
.ds-switch[aria-checked=true]{background:var(--ds-control-switch-on)}
.ds-switch:disabled{opacity:var(--ds-opacity-disabled);cursor:not-allowed}
.ds-switch:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}
.ds-switch__thumb{position:absolute;top:${inset};left:${inset};width:var(--ds-switch-thumb);height:var(--ds-switch-thumb);border-radius:var(--ds-radius-full);background:var(--ds-control-thumb);box-shadow:var(--ds-shadow-sm),0 0 0 0.5px var(--ds-surface-edge);transition:transform var(--ds-spring-snappy-duration) var(--ds-spring-snappy),width var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
.ds-switch[aria-checked=true] .ds-switch__thumb{transform:translateX(${travel})}
/* Pressed: the thumb stretches toward the middle, anchored on its current side */
.ds-switch:not(:disabled):active .ds-switch__thumb{width:calc(var(--ds-switch-thumb) + 6px)}
.ds-switch[aria-checked=true]:not(:disabled):active .ds-switch__thumb{transform:translateX(calc(${travel} - 6px))}
@media (prefers-reduced-motion:reduce){.ds-switch,.ds-switch__thumb{transition:none}}
`;
