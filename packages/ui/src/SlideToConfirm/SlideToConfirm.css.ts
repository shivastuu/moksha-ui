import { slide } from './SlideToConfirm.shared';

const ink = 'var(--ds-color-text-on-primary)';

export const slideCss = `
.ds-slide{position:relative;display:grid;place-items:center;box-sizing:border-box;height:${slide.height}px;padding:0 ${slide.knob + slide.inset * 2}px;overflow:hidden;border-radius:var(--ds-radius-full);background:var(--ds-button-primary-fill);box-shadow:var(--ds-button-primary-shadow);font-family:var(--ds-font-sans);user-select:none;-webkit-user-select:none}
.ds-slide:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}
.ds-slide[aria-disabled=true]:not([data-state=done]):not([data-state=pending]){opacity:var(--ds-opacity-disabled)}
.ds-slide__fill{position:absolute;top:0;bottom:0;left:0;width:calc(var(--ds-slide-offset) + ${slide.knob + slide.inset * 2}px);border-radius:inherit;background:color-mix(in oklab,${ink} 16%,transparent)}
.ds-slide__label{position:relative;font-size:var(--ds-font-size-md);font-weight:var(--ds-font-weight-semibold);white-space:nowrap;opacity:calc(1 - var(--ds-slide-progress) * 1.6);background:linear-gradient(90deg,color-mix(in oklab,${ink} 55%,transparent) 30%,${ink} 50%,color-mix(in oklab,${ink} 55%,transparent) 70%) 0 0/250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:ds-slide-shimmer 2.6s linear infinite}
.ds-slide:not([data-state=idle]) .ds-slide__label{opacity:1;animation:none;background:none;color:${ink}}
@keyframes ds-slide-shimmer{from{background-position:100% 0}to{background-position:-150% 0}}
.ds-slide__knob{position:absolute;top:${slide.inset}px;left:${slide.inset}px;display:grid;place-items:center;width:${slide.knob}px;height:${slide.knob}px;border-radius:var(--ds-radius-full);background:var(--ds-control-thumb);box-shadow:var(--ds-shadow-md);color:var(--ds-color-primary);font-size:20px;transform:translateX(var(--ds-slide-offset));cursor:grab;touch-action:none}
.ds-slide[data-dragging] .ds-slide__knob{cursor:grabbing;box-shadow:var(--ds-shadow-lg)}
.ds-slide:not([data-dragging]) .ds-slide__knob,.ds-slide:not([data-dragging]) .ds-slide__fill{transition:transform var(--ds-spring-snappy-duration) var(--ds-spring-snappy),width var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
.ds-slide__chevrons{display:flex;margin-left:2px}
.ds-slide__chevrons>svg+svg{margin-left:-0.55em;opacity:0.45}
.ds-slide[data-state=done] .ds-slide__knob svg{animation:ds-pop var(--ds-spring-bouncy-duration) var(--ds-spring-bouncy)}
@media (prefers-reduced-motion:reduce){.ds-slide__label{animation:none;background:none;color:${ink}}.ds-slide__knob,.ds-slide__fill{transition:none!important}}
`;
