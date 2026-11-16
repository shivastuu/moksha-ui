const spring = (property: string) => `${property} var(--ds-spring-snappy-duration) var(--ds-spring-snappy)`;

export const radioGroupCss = `
.ds-radio-group{display:grid;gap:var(--ds-space-sm);min-width:0;margin:0;padding:0;border:0;font-family:var(--ds-font-sans)}
.ds-radio-group__legend{margin-bottom:var(--ds-space-sm);padding:0;font-size:var(--ds-field-label-font-size);line-height:var(--ds-field-label-line-height);font-weight:var(--ds-field-label-font-weight);color:var(--ds-color-text)}
.ds-radio{position:relative;display:flex;align-items:flex-start;gap:var(--ds-space-md);padding:var(--ds-space-md) var(--ds-space-lg);border:var(--ds-border-width-thin) solid var(--ds-color-border);border-radius:var(--ds-radius-lg);background:var(--ds-color-background);box-shadow:var(--ds-shadow-sm);cursor:pointer;transition:${spring('border-color')},${spring('background-color')}}
.ds-radio:not([data-checked]):not([data-disabled]):hover{border-color:var(--ds-field-border-hover)}
.ds-radio[data-checked]{border-color:var(--ds-color-primary);background:var(--ds-control-selected-fill)}
.ds-radio[data-disabled]{opacity:var(--ds-opacity-disabled);cursor:not-allowed}
.ds-radio__input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:inherit}
.ds-radio__dot{display:grid;place-items:center;flex-shrink:0;box-sizing:border-box;width:var(--ds-checkbox-size);height:var(--ds-checkbox-size);margin-top:calc((var(--ds-line-height-md) - var(--ds-checkbox-size)) / 2);border:1.5px solid var(--ds-control-box-border);border-radius:var(--ds-radius-full);background:var(--ds-color-background);transition:${spring('border-color')}}
.ds-radio__dot::after{content:'';width:50%;height:50%;border-radius:var(--ds-radius-full);background:var(--ds-color-primary);transform:scale(0);transition:transform var(--ds-spring-bouncy-duration) var(--ds-spring-bouncy)}
.ds-radio[data-checked] .ds-radio__dot{border-color:var(--ds-color-primary)}
.ds-radio[data-checked] .ds-radio__dot::after{transform:scale(1)}
.ds-radio:has(.ds-radio__input:focus-visible){outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}
@media (prefers-reduced-motion:reduce){.ds-radio,.ds-radio__dot,.ds-radio__dot::after{transition:none}}
`;
