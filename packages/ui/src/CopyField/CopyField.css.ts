const icon = (property: string) => `${property} var(--ds-spring-bouncy-duration) var(--ds-spring-bouncy)`;

export const copyFieldCss = `
.ds-copy{display:flex;align-items:center;gap:var(--ds-space-md);padding:var(--ds-space-sm) var(--ds-space-sm) var(--ds-space-sm) var(--ds-space-lg);border:var(--ds-border-width-thin) solid var(--ds-color-border);border-radius:var(--ds-radius-lg);background:var(--ds-color-surface);font-family:var(--ds-font-sans)}
.ds-copy__text{display:grid;flex:1;gap:2px;min-width:0}
.ds-copy__label{font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm);color:var(--ds-color-text-muted)}
.ds-copy__value{font-size:var(--ds-font-size-md);line-height:var(--ds-line-height-md);font-weight:var(--ds-font-weight-medium);color:var(--ds-color-text);font-variant-numeric:tabular-nums;overflow-wrap:anywhere}
.ds-copy__button{position:relative;display:grid;place-items:center;flex-shrink:0;width:var(--ds-icon-button-md);height:var(--ds-icon-button-md);padding:0;border:0;border-radius:var(--ds-radius-full);background:transparent;color:var(--ds-color-text-muted);font-size:18px;cursor:pointer;isolation:isolate}
.ds-copy__button::before{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;background:currentColor;opacity:0;transition:opacity var(--ds-duration-fast) var(--ds-easing-standard)}
.ds-copy__button:hover::before{opacity:0.08}
.ds-copy__button:active::before{opacity:0.14}
.ds-copy__button:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}
.ds-copy__icon{grid-area:1/1;transition:${icon('transform')},opacity var(--ds-duration-fast) var(--ds-easing-standard)}
.ds-copy__check{color:var(--ds-text-tone-success);opacity:0;transform:scale(0.4)}
.ds-copy__button[data-copied] .ds-copy__check{opacity:1;transform:scale(1)}
.ds-copy__button[data-copied] .ds-copy__sheets{opacity:0;transform:scale(0.4)}
@media (prefers-reduced-motion:reduce){.ds-copy__icon,.ds-copy__button::before{transition:none}}
`;
