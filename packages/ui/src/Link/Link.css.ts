export const linkCss = `
.ds-link{display:inline-flex;align-items:baseline;gap:0.15em;border-radius:var(--ds-radius-sm);font-weight:var(--ds-font-weight-medium);text-decoration:none;cursor:pointer;background-image:linear-gradient(currentColor, currentColor);background-position:0 100%;background-repeat:no-repeat;background-size:0% 1px;transition:background-size var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
.ds-link--primary{color:var(--ds-text-tone-primary)}
.ds-link--default{color:var(--ds-color-text)}
.ds-link--underline-always,.ds-link:hover{background-size:100% 1px}
.ds-link:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}
.ds-link__arrow{width:0.85em;height:0.85em;align-self:center;transition:transform var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
.ds-link:hover .ds-link__arrow{transform:translate(0.1em, -0.1em)}
@media (prefers-reduced-motion:reduce){.ds-link,.ds-link__arrow{transition:none}}
`;
