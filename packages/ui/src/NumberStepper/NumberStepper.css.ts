import { stepperButton } from './NumberStepper.shared';

export const stepperCss = `
.ds-stepper{display:flex;align-items:center;justify-content:space-between;gap:var(--ds-space-lg);font-family:var(--ds-font-sans)}
.ds-stepper__label{font-size:var(--ds-font-size-md);line-height:var(--ds-line-height-md);color:var(--ds-color-text)}
.ds-stepper__control{display:flex;align-items:center;gap:var(--ds-space-xs)}
.ds-stepper__button{position:relative;display:grid;place-items:center;width:${stepperButton}px;height:${stepperButton}px;padding:0;border:1.5px solid var(--ds-control-box-border);border-radius:var(--ds-radius-full);background:var(--ds-color-background);color:var(--ds-color-text);font:inherit;font-size:18px;line-height:1;cursor:pointer;isolation:isolate;transition:transform var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
.ds-stepper__button:disabled{opacity:var(--ds-opacity-disabled);cursor:not-allowed}
.ds-stepper__value{display:grid;min-width:3ch;padding:0 var(--ds-space-xs);overflow:hidden;border-radius:var(--ds-radius-sm);font-size:var(--ds-font-size-md);line-height:var(--ds-line-height-md);font-weight:var(--ds-font-weight-semibold);font-variant-numeric:tabular-nums;color:var(--ds-color-text);text-align:center}
.ds-stepper__value:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}
.ds-stepper__number[data-direction=up]{animation:ds-stepper-up var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
.ds-stepper__number[data-direction=down]{animation:ds-stepper-down var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
@keyframes ds-stepper-up{from{opacity:0;transform:translateY(60%)}}
@keyframes ds-stepper-down{from{opacity:0;transform:translateY(-60%)}}
.ds-stepper--disabled{opacity:var(--ds-opacity-disabled)}
@media (prefers-reduced-motion:reduce){.ds-stepper__button{transition:none}.ds-stepper__number{animation:none!important}}
`;
