export const breadcrumbsCss = `
.ds-breadcrumbs__list{display:flex;flex-wrap:wrap;align-items:center;gap:var(--ds-space-xs);margin:0;padding:0;list-style:none;font-family:var(--ds-font-sans);font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm)}
.ds-breadcrumbs__item{display:inline-flex;align-items:center;gap:var(--ds-space-xs);min-width:0}
.ds-breadcrumbs__separator{flex-shrink:0;font-size:14px;color:var(--ds-color-text-muted)}
.ds-breadcrumbs__link{padding:0;border:0;background:none;color:var(--ds-color-text-muted);font:inherit;text-decoration-line:underline;text-decoration-thickness:1px;text-underline-offset:0.22em;text-decoration-color:transparent;cursor:pointer;transition:color var(--ds-duration-fast) var(--ds-easing-standard),text-decoration-color var(--ds-duration-fast) var(--ds-easing-standard)}
@media (hover:hover){.ds-breadcrumbs__link:hover{color:var(--ds-color-text);text-decoration-color:currentColor}}
.ds-breadcrumbs__link:focus-visible,.ds-breadcrumbs__more:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset);border-radius:var(--ds-radius-sm)}
.ds-breadcrumbs__current{overflow:hidden;color:var(--ds-color-text);font-weight:var(--ds-font-weight-medium);white-space:nowrap;text-overflow:ellipsis}
.ds-breadcrumbs__more{display:inline-grid;place-items:center;height:20px;padding:0 var(--ds-space-xs);border:0;border-radius:var(--ds-radius-sm);background:var(--ds-control-segment-track);color:var(--ds-color-text-muted);font:inherit;line-height:1;cursor:pointer}
@media (hover:hover){.ds-breadcrumbs__more:hover{color:var(--ds-color-text)}}
@media (prefers-reduced-motion:reduce){.ds-breadcrumbs__link{transition:none}}
`;
