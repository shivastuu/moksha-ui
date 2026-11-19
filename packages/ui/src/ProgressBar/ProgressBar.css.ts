import { breathe } from '../motion/motion.css';

const tones = ['primary', 'success', 'warning', 'danger'].map((tone) => `.ds-progress--${tone}{--ds-progress-fill:var(--ds-progress-${tone})}`).join('');

export const progressBarCss = `
.ds-progress{position:relative;width:100%;overflow:hidden;border-radius:var(--ds-radius-full);background:var(--ds-progress-track)}
.ds-progress--sm{height:var(--ds-progress-bar-sm)}.ds-progress--md{height:var(--ds-progress-bar-md)}
${tones}
.ds-progress__fill{width:100%;height:100%;border-radius:inherit;background:var(--ds-progress-fill);transform:translateX(-100%);transition:transform var(--ds-spring-smooth-duration) var(--ds-spring-smooth)}
/* Unknown amount of work: the whole fill breathes, like every loader. With reduced motion it holds dimmed, so it never reads as done */
.ds-progress[data-indeterminate] .ds-progress__fill{transform:none;transition:none;animation:${breathe()}}
@media (prefers-reduced-motion:reduce){.ds-progress__fill{transition:none}.ds-progress[data-indeterminate] .ds-progress__fill{animation:none;opacity:var(--ds-breathe-low)}}
`;
