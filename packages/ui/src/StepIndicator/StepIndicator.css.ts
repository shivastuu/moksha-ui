import { stepDot } from './StepIndicator.shared';

// Each step after the first draws the line from the previous circle to its own: a gray track, and a
// brand fill that springs across once that step is reached
const line = `content:'';position:absolute;top:${stepDot / 2 - 1}px;right:calc(50% + ${stepDot / 2 + 6}px);left:calc(-50% + ${stepDot / 2 + 6}px);height:2px;border-radius:var(--ds-radius-full)`;

export const stepsCss = `
.ds-steps{display:grid;margin:0;padding:0;list-style:none;font-family:var(--ds-font-sans)}
.ds-steps__step{position:relative;display:grid;justify-items:center;align-content:start;gap:var(--ds-space-sm);min-width:0;text-align:center}
.ds-steps__step+.ds-steps__step::before{${line};background:var(--ds-color-border)}
.ds-steps__step+.ds-steps__step::after{${line};background:var(--ds-control-indicator);transform:scaleX(0);transform-origin:left;transition:transform var(--ds-spring-smooth-duration) var(--ds-spring-smooth)}
.ds-steps__step:is([data-state=complete],[data-state=current])::after{transform:scaleX(1)}
.ds-steps__dot{display:grid;place-items:center;box-sizing:border-box;width:${stepDot}px;height:${stepDot}px;border:1.5px solid var(--ds-control-box-border);border-radius:var(--ds-radius-full);background:var(--ds-color-background);color:var(--ds-color-text-muted);font-size:var(--ds-font-size-sm);font-weight:var(--ds-font-weight-semibold);font-variant-numeric:tabular-nums;transition:background-color var(--ds-duration-normal) var(--ds-easing-standard),border-color var(--ds-duration-normal) var(--ds-easing-standard),box-shadow var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
.ds-steps__step[data-state=current] .ds-steps__dot{border-color:var(--ds-control-indicator);color:var(--ds-text-tone-primary);box-shadow:0 0 0 4px var(--ds-control-selected-fill)}
.ds-steps__step[data-state=complete] .ds-steps__dot{border-color:var(--ds-color-primary);background:var(--ds-color-primary);color:var(--ds-color-text-on-primary)}
.ds-steps__check{font-size:14px;animation:ds-pop var(--ds-spring-bouncy-duration) var(--ds-spring-bouncy)}
.ds-steps__label{max-width:100%;font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm);color:var(--ds-color-text-muted);overflow-wrap:anywhere}
.ds-steps__step:not([data-state=upcoming]) .ds-steps__label{color:var(--ds-color-text)}
.ds-steps__step[data-state=current] .ds-steps__label{font-weight:var(--ds-font-weight-medium)}
@media (prefers-reduced-motion:reduce){.ds-steps__step::after,.ds-steps__dot{transition:none}.ds-steps__check{animation:none}}
`;
