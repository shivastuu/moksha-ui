const tones = ['primary', 'success', 'warning', 'danger'].map((tone) => `.ds-ring--${tone}{color:var(--ds-color-${tone})}`).join('');

export const progressRingCss = `
.ds-ring{position:relative;display:inline-grid;place-items:center;flex-shrink:0;font-family:var(--ds-font-sans)}
${tones}
.ds-ring svg{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)}
.ds-ring__track{fill:none;stroke:var(--ds-progress-track)}
.ds-ring__arc{fill:none;stroke:currentColor;stroke-linecap:round;transition:stroke-dasharray var(--ds-spring-smooth-duration) var(--ds-spring-smooth)}
.ds-ring__center{position:relative;color:var(--ds-color-text);font-weight:var(--ds-font-weight-semibold);font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){.ds-ring__arc{transition:none}}
`;
