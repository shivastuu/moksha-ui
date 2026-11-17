export const paginationCss = `
.ds-pagination__list{display:flex;align-items:center;gap:var(--ds-space-xs);margin:0;padding:0;list-style:none;font-family:var(--ds-font-sans)}
.ds-pagination__item{position:relative;display:grid;place-items:center;box-sizing:border-box;min-width:36px;height:36px;padding:0 var(--ds-space-sm);border:0;border-radius:var(--ds-radius-full);background:transparent;color:var(--ds-color-text);font:inherit;font-size:var(--ds-font-size-sm);font-weight:var(--ds-font-weight-medium);font-variant-numeric:tabular-nums;cursor:pointer;isolation:isolate;transition:color var(--ds-duration-fast) var(--ds-easing-standard),transform var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
.ds-pagination__item[aria-current]{background:var(--ds-button-primary-fill);color:var(--ds-color-text-on-primary);box-shadow:var(--ds-button-primary-shadow);animation:ds-pop var(--ds-spring-bouncy-duration) var(--ds-spring-bouncy)}
.ds-pagination__item:disabled{color:var(--ds-color-text-muted);opacity:var(--ds-opacity-disabled);cursor:not-allowed}
.ds-pagination__item:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}
.ds-pagination__gap{min-width:24px;color:var(--ds-color-text-muted);text-align:center}
.ds-pagination__arrow{font-size:16px}
@media (prefers-reduced-motion:reduce){.ds-pagination__item{transition:none;animation:none!important}}
`;
