/** For loaders: breathe out and in on the theme's rhythm, forever (half a period each way) */
export const breathe = (keyframes = 'ds-breathe') => `${keyframes} calc(var(--ds-breathe-period) / 2) var(--ds-breathe-easing) infinite alternate`;

/**
 * One press feel for everything you can press. `ds-press` washes it in the text color at the hover and pressed
 * strengths; `ds-press--object` also gives under the finger on the snappy spring (buttons, chips, keys, days), while
 * rows only highlight. Hover only where there is a real pointer, so a tap on a phone leaves nothing behind
 */
// Every control taps cleanly on phones: no grey flash over our own press feel, and no double-tap zoom when keys are
// tapped quickly (PIN pad, steppers, calendar). Pinch zoom still works. :where keeps it overridable
const tapCss = `:where(button,a,input,label,summary,[role=button],[role=tab],[role=switch],[role=radio],[role=checkbox],[role=option],[role=menuitem],[role=slider]):is([class^="ds-"],[class*=" ds-"]){-webkit-tap-highlight-color:transparent;touch-action:manipulation}`;

const pressCss = `${tapCss}
.ds-press{position:relative;isolation:isolate;transition:transform var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
.ds-press::before{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;background:currentColor;opacity:0;pointer-events:none;transition:opacity var(--ds-duration-fast) var(--ds-easing-standard)}
@media (hover:hover){.ds-press:hover:not(:disabled):not([aria-disabled=true])::before{opacity:var(--ds-opacity-hover)}}
.ds-press:active:not(:disabled):not([aria-disabled=true])::before{opacity:var(--ds-opacity-pressed)}
.ds-press--object:active:not(:disabled):not([aria-disabled=true]){transform:scale(var(--ds-motion-scale-pressed))}
@media (prefers-reduced-motion:reduce){.ds-press{transition:none}.ds-press--object:active:not(:disabled){transform:none}}
`;

export const motionCss = pressCss + `
.ds-motion{animation-fill-mode:both;animation-duration:var(--ds-duration-normal);animation-timing-function:var(--ds-easing-enter)}
.ds-motion--fade{animation-name:ds-fade}
.ds-motion--fade-up{animation-name:ds-fade-up}
.ds-motion--fade-down{animation-name:ds-fade-down}
.ds-motion--scale-in{animation-name:ds-scale-in}
.ds-motion--slide-up{animation-name:ds-slide-up}
@keyframes ds-fade{from{opacity:0}}
@keyframes ds-fade-up{from{opacity:0;transform:translateY(var(--ds-motion-distance-md))}}
@keyframes ds-fade-down{from{opacity:0;transform:translateY(calc(var(--ds-motion-distance-md) * -1))}}
@keyframes ds-scale-in{from{opacity:0;transform:scale(var(--ds-motion-scale-enter))}}
@keyframes ds-slide-up{from{opacity:0;transform:translateY(var(--ds-motion-distance-lg))}}
@keyframes ds-shake{20%{transform:translateX(var(--ds-motion-distance-sm))}40%{transform:translateX(calc(var(--ds-motion-distance-sm) * -1))}60%{transform:translateX(calc(var(--ds-motion-distance-sm) / 2))}80%{transform:translateX(calc(var(--ds-motion-distance-sm) / -2))}}
@keyframes ds-pop{from{opacity:0.4;transform:scale(var(--ds-motion-scale-pop))}}
@keyframes ds-breathe{to{opacity:var(--ds-breathe-low)}}
@media (prefers-reduced-motion:reduce){.ds-motion{animation-name:ds-fade}}
`;
