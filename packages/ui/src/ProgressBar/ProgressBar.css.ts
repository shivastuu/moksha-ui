const tones = ['primary', 'success', 'warning', 'danger'].map((tone) => `.ds-progress--${tone}{--ds-progress-fill:var(--ds-progress-${tone})}`).join('');

export const progressBarCss = `
.ds-progress{position:relative;width:100%;overflow:hidden;border-radius:var(--ds-radius-full);background:var(--ds-progress-track)}
.ds-progress--sm{height:var(--ds-progress-bar-sm)}.ds-progress--md{height:var(--ds-progress-bar-md)}
${tones}
.ds-progress__fill{width:100%;height:100%;border-radius:inherit;background:var(--ds-progress-fill);transform:translateX(-100%);transition:transform var(--ds-spring-smooth-duration) var(--ds-spring-smooth)}
.ds-progress[data-indeterminate] .ds-progress__fill{width:40%;transition:none;animation:ds-progress-sweep 1.3s var(--ds-easing-standard) infinite}
@keyframes ds-progress-sweep{from{transform:translateX(-100%)}to{transform:translateX(250%)}}
@media (prefers-reduced-motion:reduce){.ds-progress__fill{transition:none}.ds-progress[data-indeterminate] .ds-progress__fill{animation-duration:2.6s}}
`;
