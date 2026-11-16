import { fontFamily, fontWeight, radius, space } from '@shivastu/tokens';
import { buttonMetrics } from './Button.shared';

const sizes = Object.entries(buttonMetrics)
  .map(
    ([size, m]) =>
      `.ds-button--${size}{min-height:${m.height}px;padding:0 ${m.paddingX}px;font-size:${m.fontSize}px}`
  )
  .join('');

export const buttonCss = `
.ds-button{display:inline-flex;align-items:center;justify-content:center;gap:${space.sm}px;box-sizing:border-box;border:1px solid transparent;border-radius:${radius.md}px;font-family:${fontFamily.web};font-weight:${fontWeight.semibold};line-height:1.2;cursor:pointer;transition:background-color .15s ease,border-color .15s ease}
.ds-button:focus-visible{outline:2px solid var(--ds-color-focus);outline-offset:2px}
.ds-button:disabled{cursor:not-allowed}
.ds-button:disabled:not([aria-busy=true]){opacity:.5}
.ds-button[aria-busy=true]{cursor:progress}
.ds-button--full{display:flex;width:100%}
.ds-button--primary{background:var(--ds-color-primary);color:var(--ds-color-on-primary)}
.ds-button--primary:not(:disabled):hover,.ds-button--primary:not(:disabled):active{background:var(--ds-color-primary-pressed)}
.ds-button--secondary{background:transparent;color:var(--ds-color-primary);border-color:var(--ds-color-primary)}
.ds-button--secondary:not(:disabled):hover,.ds-button--secondary:not(:disabled):active{background:var(--ds-color-primary-subtle)}
.ds-button--ghost{background:transparent;color:var(--ds-color-primary)}
.ds-button--ghost:not(:disabled):hover,.ds-button--ghost:not(:disabled):active{background:var(--ds-color-primary-subtle)}
${sizes}
.ds-spinner{width:1em;height:1em;box-sizing:border-box;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:ds-spin .7s linear infinite}
@keyframes ds-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.ds-button{transition:none}.ds-spinner{animation-duration:1.6s}}
`;
