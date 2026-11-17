import { timelineDot } from './Timeline.shared';

const tone = (status: string, name: string) =>
  `.ds-timeline__item[data-status=${status}] .ds-timeline__dot{border-color:transparent;background:var(--ds-badge-${name}-background);color:var(--ds-badge-${name}-ink)}`;

// The line under each dot runs to the next one: solid green once that step is done, dashed while it is ahead
export const timelineCss = `
.ds-timeline{display:grid;margin:0;padding:0;list-style:none;font-family:var(--ds-font-sans)}
.ds-timeline__item{display:grid;grid-template-columns:${timelineDot}px minmax(0,1fr) auto;column-gap:var(--ds-space-md)}
.ds-timeline__rail{position:relative;display:flex;justify-content:center;padding-top:2px}
.ds-timeline__item:not(:last-child) .ds-timeline__rail::after{content:'';position:absolute;top:${timelineDot + 8}px;bottom:6px;left:calc(50% - 1px);border-left:2px dashed var(--ds-color-border)}
.ds-timeline__item[data-status=complete]:not(:last-child) .ds-timeline__rail::after{border-left-style:solid;border-color:var(--ds-badge-success-background)}
.ds-timeline__dot{position:relative;display:grid;place-items:center;box-sizing:border-box;width:${timelineDot}px;height:${timelineDot}px;border:2px solid var(--ds-control-box-border);border-radius:var(--ds-radius-full);background:var(--ds-color-background);font-size:12px}
${tone('complete', 'success')}
${tone('failed', 'danger')}
.ds-timeline__item[data-status=current] .ds-timeline__dot{border-color:transparent;background:var(--ds-control-indicator)}
.ds-timeline__item[data-status=current] .ds-timeline__dot::after{content:'';position:absolute;inset:-2px;border-radius:inherit;background:var(--ds-control-indicator);animation:ds-timeline-pulse 1.8s var(--ds-easing-exit) infinite}
@keyframes ds-timeline-pulse{from{opacity:0.5;transform:scale(1)}to{opacity:0;transform:scale(2.2)}}
.ds-timeline__body{display:grid;gap:2px;padding-bottom:var(--ds-space-xl)}
.ds-timeline__item:last-child .ds-timeline__body{padding-bottom:0}
.ds-timeline__title{font-size:var(--ds-font-size-md);line-height:var(--ds-line-height-md);font-weight:var(--ds-font-weight-medium);color:var(--ds-color-text)}
.ds-timeline__item[data-status=upcoming] .ds-timeline__title{color:var(--ds-color-text-muted);font-weight:var(--ds-font-weight-regular)}
.ds-timeline__description,.ds-timeline__time{font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm);color:var(--ds-color-text-muted)}
.ds-timeline__time{padding-top:2px;font-variant-numeric:tabular-nums;white-space:nowrap}
@media (prefers-reduced-motion:reduce){.ds-timeline__item[data-status=current] .ds-timeline__dot::after{animation:none;opacity:0}}
`;
