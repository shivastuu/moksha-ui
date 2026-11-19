const tones = ['danger', 'primary', 'success', 'warning', 'neutral']
  .map((tone) => `.ds-badge--${tone}{--ds-badge-edge:var(--ds-badge-${tone}-edge);--ds-badge-gloss:var(--ds-badge-${tone}-gloss);background:var(--ds-badge-${tone}-background);color:var(--ds-badge-${tone}-ink)}`)
  .join('');

export const badgeCss = `
.ds-badge{display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-width:var(--ds-badge-size);height:var(--ds-badge-size);padding:0 calc(var(--ds-badge-size) * 0.3);border-radius:var(--ds-radius-full);font-family:var(--ds-font-sans);font-size:calc(var(--ds-badge-size) * 0.55);font-weight:var(--ds-font-weight-semibold);line-height:1;font-variant-numeric:tabular-nums;box-shadow:0 0 0 2px var(--ds-color-background),inset 0 0 0 1px var(--ds-badge-edge),inset 0 1px 0 var(--ds-badge-gloss);animation:ds-badge-in var(--ds-spring-bouncy-duration) var(--ds-spring-bouncy)}
${tones}
.ds-badge--dot{width:var(--ds-badge-dot);min-width:0;height:var(--ds-badge-dot);padding:0}
@keyframes ds-badge-in{from{transform:scale(0.4);opacity:0}}
@media (prefers-reduced-motion:reduce){.ds-badge{animation:none}}
@media (forced-colors:active){.ds-badge{border:1px solid}.ds-badge--dot{background:CanvasText}}
`;
