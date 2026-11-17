import { foundations } from '@moksha-ui/tokens';

/** Sheet layout, for `.ds-dialog--sheet` and for `.ds-dialog--auto` on small screens */
const sheet = (selector: string) => `
${selector}{width:100%;max-width:var(--ds-modal-sheet-max-width);max-height:calc(100% - var(--ds-space-3xl));margin:auto auto 0;border-bottom-left-radius:0;border-bottom-right-radius:0}
${selector}[open]{animation-name:ds-sheet-in}
${selector} .ds-dialog__panel{padding-bottom:calc(var(--ds-modal-padding) + env(safe-area-inset-bottom, 0px))}
${selector} .ds-dialog__handle{display:block}`;

// Media queries cannot read CSS variables, so this uses the default theme's breakpoint
export const dialogCss = `
.ds-dialog{box-sizing:border-box;width:calc(100% - 2 * var(--ds-space-lg));max-width:var(--ds-modal-dialog-max-width);max-height:calc(100% - 2 * var(--ds-space-lg));padding:0;border:0;border-radius:var(--ds-modal-radius);background:var(--ds-color-surface-raised);color:var(--ds-color-text);box-shadow:var(--ds-shadow-lg),0 0 0 1px var(--ds-modal-edge);font-family:var(--ds-font-sans);overflow:auto;overscroll-behavior:contain}
.ds-dialog::backdrop{background:var(--ds-color-overlay);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
@keyframes ds-sheet-in{from{transform:translateY(100%)}}
.ds-dialog[open]{animation:ds-scale-in var(--ds-spring-smooth-duration) var(--ds-spring-smooth)}
.ds-dialog[open]::backdrop{animation:ds-fade var(--ds-duration-normal) var(--ds-easing-enter)}
html:has(.ds-dialog[open]){overflow:hidden}
.ds-dialog__panel{display:grid;gap:var(--ds-space-md);padding:var(--ds-modal-padding)}
.ds-dialog__handle{display:none;justify-self:center;width:var(--ds-modal-handle-width);height:var(--ds-modal-handle-height);margin-top:calc(var(--ds-space-sm) - var(--ds-modal-padding));border-radius:var(--ds-radius-full);background:var(--ds-color-border)}
.ds-dialog__title{margin:0;letter-spacing:-0.01em;font-size:var(--ds-font-size-xl);line-height:var(--ds-line-height-xl);font-weight:var(--ds-font-weight-semibold)}
.ds-dialog__content{font-size:var(--ds-font-size-md);line-height:var(--ds-line-height-md);color:var(--ds-color-text-muted)}
.ds-dialog__actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:var(--ds-space-sm);margin-top:var(--ds-space-sm)}
${sheet('.ds-dialog--sheet')}
.ds-dialog--drawer{width:min(400px,calc(100% - var(--ds-space-3xl)));max-width:none;height:100%;max-height:none;margin:0 0 0 auto;border-radius:var(--ds-modal-radius) 0 0 var(--ds-modal-radius)}
.ds-dialog--drawer-left{margin:0 auto 0 0;border-radius:0 var(--ds-modal-radius) var(--ds-modal-radius) 0}
.ds-dialog--drawer[open]{animation-name:ds-drawer-in}
.ds-dialog--drawer-left[open]{animation-name:ds-drawer-in-left}
.ds-dialog--drawer .ds-dialog__panel{display:flex;flex-direction:column;min-height:100%;box-sizing:border-box;padding-bottom:calc(var(--ds-modal-padding) + env(safe-area-inset-bottom, 0px))}
.ds-dialog--drawer .ds-dialog__actions{margin-top:auto}
@keyframes ds-drawer-in{from{transform:translateX(100%)}}
@keyframes ds-drawer-in-left{from{transform:translateX(-100%)}}
@media (max-width:${foundations.breakpoints.sm - 0.02}px){${sheet('.ds-dialog--auto')}
.ds-dialog--auto .ds-dialog__actions>*{flex:1}}
@media (prefers-reduced-motion:reduce){.ds-dialog[open]{animation-name:ds-fade}}
`;
