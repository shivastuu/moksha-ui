const spring = (property: string) => `${property} var(--ds-spring-smooth-duration) var(--ds-spring-smooth)`;

export const tabsCss = `
.ds-tabs{display:grid;gap:var(--ds-space-lg);min-width:0;font-family:var(--ds-font-sans)}
.ds-tabs__list{position:relative;display:flex;gap:var(--ds-space-xl);overflow-x:auto;scrollbar-width:none;box-shadow:inset 0 -1px 0 var(--ds-color-border)}
.ds-tabs__list::-webkit-scrollbar{display:none}
.ds-tabs__tab{flex-shrink:0;height:var(--ds-tabs-height);padding:0;border:0;background:transparent;color:var(--ds-color-text-muted);font:inherit;font-size:var(--ds-font-size-md);font-weight:var(--ds-font-weight-medium);white-space:nowrap;cursor:pointer;transition:color var(--ds-duration-fast) var(--ds-easing-standard)}
.ds-tabs__tab:hover,.ds-tabs__tab[aria-selected=true]{color:var(--ds-color-text)}
.ds-tabs__tab:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:calc(var(--ds-focus-ring-width) * -1);border-radius:var(--ds-radius-sm)}
.ds-tabs__indicator{position:absolute;bottom:0;left:0;height:var(--ds-tabs-indicator);border-radius:var(--ds-radius-full);background:var(--ds-control-indicator);pointer-events:none;transition:${spring('transform')},${spring('width')}}
.ds-tabs__panel{animation:ds-fade var(--ds-duration-normal) var(--ds-easing-enter)}
.ds-tabs__panel:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset);border-radius:var(--ds-radius-sm)}
@media (prefers-reduced-motion:reduce){.ds-tabs__tab,.ds-tabs__indicator{transition:none}.ds-tabs__panel{animation:none}}
@media (forced-colors:active){.ds-tabs__indicator{background:Highlight}}
`;
