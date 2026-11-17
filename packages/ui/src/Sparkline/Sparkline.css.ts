// The line draws from left to right, then the fill and the end dot fade in
export const sparklineCss = `
.ds-sparkline{display:block;overflow:visible}
.ds-sparkline__line{stroke-dasharray:1;stroke-dashoffset:1;animation:ds-sparkline-draw 700ms var(--ds-easing-enter) forwards}
.ds-sparkline__area,.ds-sparkline__dot{opacity:0;animation:ds-sparkline-in var(--ds-duration-normal) var(--ds-easing-enter) 500ms forwards}
@keyframes ds-sparkline-in{to{opacity:1}}
@keyframes ds-sparkline-draw{to{stroke-dashoffset:0}}
@media (prefers-reduced-motion:reduce){.ds-sparkline__line{animation:none;stroke-dashoffset:0}.ds-sparkline__area,.ds-sparkline__dot{animation:none;opacity:1}}
`;
