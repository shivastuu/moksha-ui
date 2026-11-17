import { sidebarRow } from './Sidebar.shared';

export const sidebarCss = `
.ds-sidebar{display:flex;flex-direction:column;gap:var(--ds-space-lg);box-sizing:border-box;width:260px;height:100%;padding:var(--ds-space-lg) var(--ds-space-md);background:var(--ds-color-surface);box-shadow:inset -1px 0 0 var(--ds-surface-edge);font-family:var(--ds-font-sans)}
.ds-sidebar__body{position:relative;display:grid;gap:var(--ds-space-lg);flex:1;align-content:start}
.ds-sidebar__indicator{position:absolute;top:0;right:0;left:0;border-radius:var(--ds-radius-md);background:var(--ds-color-surface-raised);box-shadow:var(--ds-shadow-sm),0 0 0 1px var(--ds-surface-edge);transition:transform var(--ds-spring-smooth-duration) var(--ds-spring-smooth),height var(--ds-spring-smooth-duration) var(--ds-spring-smooth)}
.ds-sidebar__title{margin:0 0 var(--ds-space-xs);padding:0 var(--ds-space-md);font-size:var(--ds-font-size-xs);line-height:var(--ds-line-height-xs);font-weight:var(--ds-font-weight-semibold);letter-spacing:0.04em;text-transform:uppercase;color:var(--ds-color-text-muted)}
.ds-sidebar__list{display:grid;gap:2px;margin:0;padding:0;list-style:none}
.ds-sidebar__item{position:relative;display:flex;align-items:center;gap:var(--ds-space-md);box-sizing:border-box;width:100%;height:${sidebarRow}px;padding:0 var(--ds-space-md);border:0;border-radius:var(--ds-radius-md);background:transparent;color:var(--ds-color-text-muted);font:inherit;font-size:var(--ds-font-size-sm);font-weight:var(--ds-font-weight-medium);text-align:start;cursor:pointer;isolation:isolate;transition:color var(--ds-duration-fast) var(--ds-easing-standard)}
.ds-sidebar__item::before{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;background:currentColor;opacity:0;transition:opacity var(--ds-duration-fast) var(--ds-easing-standard)}
.ds-sidebar__item:not([aria-current]):hover{color:var(--ds-color-text)}
.ds-sidebar__item:not([aria-current]):hover::before{opacity:0.05}
.ds-sidebar__item[aria-current]{color:var(--ds-color-text)}
.ds-sidebar__item:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:calc(var(--ds-focus-ring-width) * -1)}
.ds-sidebar__icon{display:grid;place-items:center;width:20px;font-size:20px}
.ds-sidebar__item[aria-current] .ds-sidebar__icon{color:var(--ds-text-tone-primary)}
.ds-sidebar__label{flex:1;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.ds-sidebar__count{min-width:20px;padding:0 6px;border-radius:var(--ds-radius-full);background:var(--ds-control-segment-track);color:var(--ds-color-text);font-size:var(--ds-font-size-xs);line-height:20px;font-variant-numeric:tabular-nums;text-align:center}
@media (prefers-reduced-motion:reduce){.ds-sidebar__indicator,.ds-sidebar__item,.ds-sidebar__item::before{transition:none}}
`;
