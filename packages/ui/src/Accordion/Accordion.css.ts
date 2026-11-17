const spring = (property: string, name = 'smooth') => `${property} var(--ds-spring-${name}-duration) var(--ds-spring-${name})`;

// Opening animates grid-template-rows from 0fr to 1fr: a height transition to the content's own height
export const accordionCss = `
.ds-accordion{overflow:hidden;border-radius:var(--ds-radius-xl);background:var(--ds-color-surface-raised);box-shadow:var(--ds-shadow-sm),0 0 0 1px var(--ds-surface-edge);font-family:var(--ds-font-sans)}
.ds-accordion__item{position:relative}
.ds-accordion__item+.ds-accordion__item::before{content:'';position:absolute;top:0;right:var(--ds-space-lg);left:var(--ds-space-lg);height:1px;background:var(--ds-surface-edge)}
.ds-accordion__heading{margin:0;font:inherit}
.ds-accordion__trigger{position:relative;display:flex;align-items:center;justify-content:space-between;gap:var(--ds-space-md);box-sizing:border-box;width:100%;padding:var(--ds-space-lg);border:0;background:transparent;color:var(--ds-color-text);font:inherit;font-size:var(--ds-font-size-md);line-height:var(--ds-line-height-md);font-weight:var(--ds-font-weight-medium);text-align:start;cursor:pointer;isolation:isolate}
.ds-accordion__trigger:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:calc(var(--ds-focus-ring-width) * -1)}
.ds-accordion__chevron{flex-shrink:0;font-size:18px;color:var(--ds-color-text-muted);transition:${spring('transform', 'snappy')}}
.ds-accordion__item[data-open] .ds-accordion__chevron{transform:rotate(180deg)}
.ds-accordion__panel{display:grid;grid-template-rows:0fr;transition:${spring('grid-template-rows')}}
.ds-accordion__item[data-open] .ds-accordion__panel{grid-template-rows:1fr}
.ds-accordion__clip{min-height:0;overflow:hidden}
.ds-accordion__content{padding:0 var(--ds-space-lg) var(--ds-space-lg);font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm);color:var(--ds-color-text-muted);opacity:0;transition:opacity var(--ds-duration-fast) var(--ds-easing-standard)}
.ds-accordion__item[data-open] .ds-accordion__content{opacity:1;transition-duration:var(--ds-duration-slow)}
@media (prefers-reduced-motion:reduce){.ds-accordion__chevron,.ds-accordion__panel,.ds-accordion__content{transition:none}}
`;
