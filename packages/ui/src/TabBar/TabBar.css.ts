import { tabItem } from './TabBar.shared';

export const tabBarCss = `
.ds-tabbar{position:relative;display:grid;font-family:var(--ds-font-sans)}
.ds-tabbar__indicator{position:absolute;top:0;bottom:0;left:0;border-radius:var(--ds-radius-full);background:var(--ds-color-surface-raised);box-shadow:var(--ds-shadow-sm),0 0 0 1px var(--ds-surface-edge);transition:transform var(--ds-spring-smooth-duration) var(--ds-spring-smooth)}
.ds-tabbar__item{position:relative;display:grid;justify-items:center;align-content:start;gap:${tabItem.gap}px;min-width:0;min-height:${tabItem.height}px;padding:calc((${tabItem.height - tabItem.icon - tabItem.gap}px - var(--ds-line-height-xs)) / 2) 0;border:0;border-radius:var(--ds-radius-full);background:transparent;color:var(--ds-color-text-muted);font:inherit;cursor:pointer;transition:color var(--ds-duration-fast) var(--ds-easing-standard),transform var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
.ds-tabbar__item[aria-current]{color:var(--ds-text-tone-primary)}
@media (hover:hover){.ds-tabbar__item:hover{color:var(--ds-text-tone-primary)}}
@media (hover:hover){.ds-tabbar__item:not([aria-current]):hover{color:var(--ds-color-text)}}
.ds-tabbar__item:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:calc(var(--ds-focus-ring-width) * -1)}
.ds-tabbar__icon{position:relative;display:grid;place-items:center;height:${tabItem.icon}px;font-size:22px;transition:transform var(--ds-spring-bouncy-duration) var(--ds-spring-bouncy)}
.ds-tabbar__item[aria-current] .ds-tabbar__icon{transform:translateY(-1px) scale(1.06)}
.ds-tabbar__badge{position:absolute;top:-7px;left:calc(100% - 5px)}
.ds-tabbar__label{max-width:100%;text-align:center;overflow-wrap:break-word;font-size:var(--ds-font-size-xs);line-height:var(--ds-line-height-xs);font-weight:var(--ds-font-weight-medium)}
@media (prefers-reduced-motion:reduce){.ds-tabbar__indicator,.ds-tabbar__item,.ds-tabbar__icon{transition:none}}
@media (forced-colors:active){.ds-tabbar__indicator{outline:2px solid Highlight;outline-offset:-2px}}
`;
