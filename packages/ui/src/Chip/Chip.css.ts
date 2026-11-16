export const chipCss = `
.ds-chip{display:inline-flex;align-items:center;gap:var(--ds-space-xs);box-sizing:border-box;border:var(--ds-border-width-thin) solid var(--ds-color-border);border-radius:var(--ds-radius-full);background:var(--ds-color-background);color:var(--ds-color-text);box-shadow:var(--ds-shadow-sm);font-family:var(--ds-font-sans);font-weight:var(--ds-font-weight-medium);white-space:nowrap;cursor:pointer;transition:background-color var(--ds-spring-snappy-duration) var(--ds-spring-snappy),border-color var(--ds-spring-snappy-duration) var(--ds-spring-snappy),color var(--ds-spring-snappy-duration) var(--ds-spring-snappy),transform var(--ds-duration-fast) var(--ds-easing-standard)}
.ds-chip--sm{height:32px;padding:0 var(--ds-space-md);font-size:var(--ds-font-size-xs)}
.ds-chip--md{height:36px;padding:0 calc(var(--ds-space-md) + 2px);font-size:var(--ds-font-size-sm)}
/* Only unselected chips darken on hover, so a selected chip keeps its brand border under the pointer */
.ds-chip[aria-pressed=false]:not(:disabled):hover{border-color:var(--ds-field-border-hover)}
.ds-chip[aria-pressed=true]{background:var(--ds-control-selected-fill);border-color:var(--ds-chip-selected-border);color:var(--ds-color-primary)}
.ds-chip:not(:disabled):active{transform:scale(var(--ds-motion-scale-pressed))}
.ds-chip:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}
.ds-chip:disabled{opacity:var(--ds-opacity-disabled);cursor:not-allowed}
.ds-chip>svg{width:1.15em;height:1.15em;flex-shrink:0}
.ds-chip__check{animation:ds-badge-in var(--ds-spring-bouncy-duration) var(--ds-spring-bouncy)}
@media (prefers-reduced-motion:reduce){.ds-chip{transition:none}.ds-chip__check{animation:none}.ds-chip:not(:disabled):active{transform:none}}
`;
