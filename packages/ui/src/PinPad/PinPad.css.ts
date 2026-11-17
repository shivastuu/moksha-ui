import { pinPad } from './PinPad.shared';

const snappy = (property: string) => `${property} var(--ds-spring-snappy-duration) var(--ds-spring-snappy)`;

export const pinPadCss = `
.ds-pin{display:grid;justify-items:center;gap:var(--ds-space-lg);font-family:var(--ds-font-sans)}
.ds-pin__label{margin:0;font-size:var(--ds-text-title-size);line-height:var(--ds-text-title-line-height);font-weight:var(--ds-text-title-weight);color:var(--ds-color-text)}
.ds-pin__dots{display:flex;gap:var(--ds-space-lg);padding:var(--ds-space-sm) 0}
.ds-pin__dots--shake{animation:ds-shake var(--ds-duration-slow) var(--ds-easing-standard)}
.ds-pin__dot{box-sizing:border-box;width:${pinPad.dot}px;height:${pinPad.dot}px;border:1.5px solid var(--ds-control-box-border);border-radius:var(--ds-radius-full);transition:${snappy('background-color')},${snappy('border-color')}}
.ds-pin__dot[data-filled]{border-color:var(--ds-color-text);background:var(--ds-color-text);animation:ds-pop var(--ds-spring-bouncy-duration) var(--ds-spring-bouncy)}
.ds-pin--invalid .ds-pin__dot{border-color:var(--ds-color-danger)}
.ds-pin--invalid .ds-pin__dot[data-filled]{background:var(--ds-color-danger)}
.ds-pin__message{min-height:var(--ds-line-height-sm);margin:0;font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm);color:var(--ds-text-tone-danger);text-align:center}
.ds-pin__keys{display:grid;grid-template-columns:repeat(3,${pinPad.key}px);gap:${pinPad.rowGap}px ${pinPad.columnGap}px}
.ds-pin__key{position:relative;display:grid;place-items:center;width:${pinPad.key}px;height:${pinPad.key}px;padding:0;border:0;border-radius:var(--ds-radius-full);background:var(--ds-color-surface);box-shadow:0 0 0 1px var(--ds-surface-edge);color:var(--ds-color-text);font:inherit;font-size:28px;font-weight:var(--ds-font-weight-regular);font-variant-numeric:tabular-nums;cursor:pointer;isolation:isolate;transition:${snappy('transform')}}
.ds-pin__key::before{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;background:currentColor;opacity:0;transition:opacity var(--ds-duration-fast) var(--ds-easing-standard)}
.ds-pin__key:hover::before{opacity:0.05}
.ds-pin__key:active{transform:scale(var(--ds-motion-scale-pressed))}
.ds-pin__key:active::before{opacity:0.12}
.ds-pin__key--delete{background:transparent;box-shadow:none;color:var(--ds-color-text-muted);font-size:24px}
.ds-pin__key:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}
@media (prefers-reduced-motion:reduce){.ds-pin__key,.ds-pin__dot{transition:none}.ds-pin__dot[data-filled]{animation:none}.ds-pin__dots--shake{--ds-motion-distance-sm:0px}}
`;
