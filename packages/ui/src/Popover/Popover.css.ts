// Shared by Popover, Menu and Tooltip. It grows out of the side that faces the trigger
export const floatingCss = `
.ds-floating{position:fixed;inset:auto;margin:0;padding:0;border:0;overflow:visible;background:transparent;color:var(--ds-color-text);font-family:var(--ds-font-sans);animation:ds-floating-in var(--ds-spring-smooth-duration) var(--ds-spring-smooth)}
.ds-floating[data-side=bottom]{transform-origin:top}
.ds-floating[data-side=top]{transform-origin:bottom}
@keyframes ds-floating-in{from{opacity:0;transform:scale(0.96)}}
.ds-floating:focus{outline:none}
.ds-popover{box-sizing:border-box;max-width:min(320px,calc(100vw - 16px));padding:var(--ds-space-lg);border-radius:var(--ds-radius-lg);background:var(--ds-color-surface-raised);box-shadow:var(--ds-shadow-lg),0 0 0 1px var(--ds-surface-edge);font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm)}
.ds-menu{display:grid;min-width:200px;padding:var(--ds-space-xs);border-radius:var(--ds-radius-lg);background:var(--ds-color-surface-raised);box-shadow:var(--ds-shadow-lg),0 0 0 1px var(--ds-surface-edge)}
.ds-menu__item{position:relative;display:flex;align-items:center;gap:var(--ds-space-sm);height:40px;padding:0 var(--ds-space-md);border:0;border-radius:var(--ds-radius-md);background:transparent;color:var(--ds-color-text);font:inherit;font-size:var(--ds-font-size-sm);font-weight:var(--ds-font-weight-medium);text-align:start;cursor:pointer;isolation:isolate}
.ds-menu__item:focus-visible{outline:var(--ds-focus-ring-width) solid transparent;outline-offset:calc(var(--ds-focus-ring-width) * -1)}
.ds-menu__item:focus-visible::before{opacity:var(--ds-opacity-hover)}
.ds-menu__item[data-tone=danger]{color:var(--ds-text-tone-danger)}
.ds-menu__item:disabled{color:var(--ds-color-text-muted);opacity:var(--ds-opacity-disabled);cursor:not-allowed}
.ds-menu__icon{display:grid;place-items:center;width:18px;font-size:18px;color:var(--ds-color-text-muted)}
.ds-menu__item[data-tone=danger] .ds-menu__icon{color:inherit}
.ds-tooltip{padding:var(--ds-space-xs) var(--ds-space-sm);border-radius:var(--ds-radius-sm);background:var(--ds-color-surface-inverse);box-shadow:var(--ds-shadow-md);color:var(--ds-color-text-inverse);font-size:var(--ds-font-size-xs);line-height:var(--ds-line-height-xs);font-weight:var(--ds-font-weight-medium);white-space:nowrap;pointer-events:none;animation-duration:var(--ds-duration-fast)}
.ds-tooltip-anchor{display:inline-flex}
@media (prefers-reduced-motion:reduce){.ds-floating{animation-name:ds-fade}}
`;
