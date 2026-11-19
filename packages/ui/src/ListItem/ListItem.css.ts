// ListItem and ListGroup. A row's divider sits on its content area, so it starts under the title
// whatever the leading slot holds (inset grouped, like iOS settings)
export const listCss = `
.ds-list-item{position:relative;display:flex;align-items:center;gap:var(--ds-space-md);box-sizing:border-box;width:100%;padding:0 0 0 var(--ds-space-lg);border:0;background:transparent;color:var(--ds-color-text);font:inherit;font-family:var(--ds-font-sans);text-align:start;isolation:isolate}
button.ds-list-item{cursor:pointer}
button.ds-list-item:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:calc(var(--ds-focus-ring-width) * -1)}
button.ds-list-item:disabled{opacity:var(--ds-opacity-disabled);cursor:not-allowed}
.ds-list-item__leading{display:flex;flex-shrink:0}
.ds-list-item__content{display:flex;flex:1;align-items:center;align-self:stretch;gap:var(--ds-space-md);min-width:0;padding:var(--ds-space-md) var(--ds-space-lg) var(--ds-space-md) 0}
.ds-list-item__text{display:grid;flex:1;gap:2px;min-width:0}
.ds-list-item__title{font-size:var(--ds-font-size-md);line-height:var(--ds-line-height-md);font-weight:var(--ds-font-weight-medium)}
.ds-list-item__description{font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm);color:var(--ds-color-text-muted)}
.ds-list-item__value{flex:0 1 auto;max-width:50%;text-align:end;overflow-wrap:break-word;font-size:var(--ds-font-size-md);line-height:var(--ds-line-height-md);color:var(--ds-color-text-muted);font-variant-numeric:tabular-nums}
.ds-list-item__trailing{display:flex;flex-shrink:0}
.ds-list-item__chevron{flex-shrink:0;font-size:16px;color:var(--ds-color-text-muted);transition:transform var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
button.ds-list-item:hover:not(:disabled) .ds-list-item__chevron{transform:translateX(2px)}
.ds-list-group{display:grid;gap:var(--ds-space-sm);min-width:0;font-family:var(--ds-font-sans)}
.ds-list-group__title,.ds-list-group__footer{margin:0;padding:0 var(--ds-space-lg);font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm);color:var(--ds-color-text-muted)}
.ds-list-group__title{font-weight:var(--ds-font-weight-medium)}
.ds-list-group__list{margin:0;padding:0;list-style:none;overflow:hidden;border-radius:var(--ds-radius-xl);background:var(--ds-color-surface-raised);box-shadow:var(--ds-shadow-sm),0 0 0 1px var(--ds-surface-edge)}
.ds-list-group__item+.ds-list-group__item .ds-list-item__content{box-shadow:inset 0 1px 0 var(--ds-surface-edge)}
@media (prefers-reduced-motion:reduce){.ds-list-item__chevron{transition:none}}
`;
