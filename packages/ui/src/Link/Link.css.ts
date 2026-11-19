// A real text underline, placed by the font's metrics and faded in, on the text only (not under the arrow)
export const linkCss = `
.ds-link{border-radius:var(--ds-radius-sm);font-weight:var(--ds-font-weight-medium);text-decoration:none;cursor:pointer}
.ds-link--primary{color:var(--ds-text-tone-primary)}
.ds-link--default{color:var(--ds-color-text)}
.ds-link__text{text-decoration-line:underline;text-decoration-thickness:1px;text-underline-offset:0.22em;text-decoration-color:transparent;transition:text-decoration-color var(--ds-duration-fast) var(--ds-easing-standard)}
.ds-link--underline-always .ds-link__text{text-decoration-color:currentColor}
@media (hover:hover){.ds-link:hover .ds-link__text{text-decoration-color:currentColor}}
.ds-link:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}
.ds-link__arrow{display:inline-block;width:0.8em;height:0.8em;vertical-align:-0.02em;transition:transform var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
@media (hover:hover){.ds-link:hover .ds-link__arrow{transform:translate(0.1em, -0.1em)}}
@media (prefers-reduced-motion:reduce){.ds-link__text,.ds-link__arrow{transition:none}}
`;
