export const spinnerCss = `
.ds-loader{display:inline-flex;flex-shrink:0;color:var(--ds-color-primary)}
.ds-loader--current{color:inherit}
.ds-loader svg{width:100%;height:100%;animation:ds-spin 0.75s linear infinite}
.ds-loader__track{stroke:currentColor;opacity:0.18}
.ds-loader__arc{stroke:currentColor}
@media (prefers-reduced-motion:reduce){.ds-loader svg{animation-duration:1.6s}}
`;
