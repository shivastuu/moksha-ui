export const checkboxCss = `
.ds-checkbox-row{justify-content:flex-start;align-items:flex-start;gap:var(--ds-space-md)}
.ds-checkbox{position:relative;flex-shrink:0;display:grid;place-items:center;box-sizing:border-box;width:var(--ds-checkbox-size);height:var(--ds-checkbox-size);margin-top:calc((var(--ds-line-height-md) - var(--ds-checkbox-size)) / 2);border:1.5px solid var(--ds-control-box-border);border-radius:var(--ds-checkbox-radius);background:var(--ds-color-background);color:var(--ds-color-text-on-primary);transition:background-color var(--ds-spring-snappy-duration) var(--ds-spring-snappy),border-color var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
.ds-checkbox[data-state=checked],.ds-checkbox[data-state=mixed]{border-color:var(--ds-color-primary);background:var(--ds-color-primary)}
.ds-checkbox__input{position:absolute;inset:-6px;width:calc(100% + 12px);height:calc(100% + 12px);margin:0;opacity:0;cursor:inherit}
.ds-checkbox__mark{width:72%;height:72%}
/* The mark draws itself in: a path of length 1, dashed, with the dash sliding into view */
.ds-checkbox__mark path{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
.ds-checkbox[data-state=checked] .ds-checkbox__mark path,.ds-checkbox[data-state=mixed] .ds-checkbox__mark path{stroke-dashoffset:0}
.ds-checkbox:has(.ds-checkbox__input:focus-visible){outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}
@media (prefers-reduced-motion:reduce){.ds-checkbox,.ds-checkbox__mark path{transition:none}}
`;
