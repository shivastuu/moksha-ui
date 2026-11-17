// The arc grows and shrinks on the breathe rhythm while the whole thing turns
export const spinnerCss = `
.ds-loader{display:inline-flex;flex-shrink:0;color:var(--ds-color-primary)}
.ds-loader--current{color:inherit}
.ds-loader svg{width:100%;height:100%;animation:ds-spin 1s linear infinite}
.ds-loader__track{stroke:currentColor;opacity:0.18}
.ds-loader__arc{stroke:currentColor;animation:ds-loader-breathe calc(var(--ds-breathe-period) / 2) var(--ds-breathe-easing) infinite alternate}
@keyframes ds-loader-breathe{from{stroke-dasharray:14 100;stroke-dashoffset:0}to{stroke-dasharray:62 100;stroke-dashoffset:-30}}
@media (prefers-reduced-motion:reduce){.ds-loader svg{animation-duration:1.6s}.ds-loader__arc{animation:none}}
`;
