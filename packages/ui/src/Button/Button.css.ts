import { components } from '@shivastu/tokens';

const { button } = components;

const sizes = Object.entries(button.sizes)
  .map(
    ([size, m]) =>
      `.ds-button--${size}{min-height:${m.height}px;padding:0 ${m.paddingX}px;font-size:${m.fontSize}px}`
  )
  .join('');

export const buttonCss = `
.ds-button{display:inline-flex;align-items:center;justify-content:center;gap:${button.gap}px;box-sizing:border-box;border:${button.borderWidth}px solid transparent;border-radius:${button.radius}px;font-family:var(--ds-font-sans);font-weight:${button.fontWeight};line-height:1.2;cursor:pointer;transition:background-color var(--ds-duration-fast) var(--ds-easing-standard),border-color var(--ds-duration-fast) var(--ds-easing-standard)}
.ds-button:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}
.ds-button:disabled{cursor:not-allowed}
.ds-button:disabled:not([aria-busy=true]){opacity:var(--ds-opacity-disabled)}
.ds-button[aria-busy=true]{cursor:progress}
.ds-button--full{display:flex;width:100%}
.ds-button--primary{background:var(--ds-color-primary);color:var(--ds-color-text-on-primary)}
.ds-button--primary:not(:disabled):hover,.ds-button--primary:not(:disabled):active{background:var(--ds-color-primary-pressed)}
.ds-button--secondary{background:transparent;color:var(--ds-color-primary);border-color:var(--ds-color-primary)}
.ds-button--secondary:not(:disabled):hover,.ds-button--secondary:not(:disabled):active{background:var(--ds-color-primary-subtle)}
.ds-button--ghost{background:transparent;color:var(--ds-color-primary)}
.ds-button--ghost:not(:disabled):hover,.ds-button--ghost:not(:disabled):active{background:var(--ds-color-primary-subtle)}
${sizes}
.ds-spinner{width:1em;height:1em;box-sizing:border-box;border:var(--ds-border-width-thick) solid currentColor;border-right-color:transparent;border-radius:50%;animation:ds-spin .7s linear infinite}
@keyframes ds-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.ds-button{transition:none}.ds-spinner{animation-duration:1.6s}}
`;
