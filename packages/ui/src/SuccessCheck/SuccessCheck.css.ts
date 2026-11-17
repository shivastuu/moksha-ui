import { successTiming as t } from './SuccessCheck.shared';

// The check sits on its own layer: the animated disc gets a stacking context and would otherwise paint over it
export const successCss = `
.ds-success{position:relative;display:inline-grid;place-items:center;flex-shrink:0;width:var(--ds-success-size);height:var(--ds-success-size)}
.ds-success__ring,.ds-success__disc{grid-area:1/1;width:100%;height:100%;border-radius:var(--ds-radius-full);background:var(--ds-badge-success-background)}
.ds-success__ring{opacity:0;animation:ds-success-ring ${t.ringDuration}ms var(--ds-easing-exit) ${t.ringDelay}ms}
.ds-success__disc{background-image:linear-gradient(180deg,var(--ds-badge-success-gloss),transparent 60%);box-shadow:inset 0 0 0 1px var(--ds-badge-success-edge),0 12px 28px -10px var(--ds-badge-success-background);animation:ds-success-pop var(--ds-spring-bouncy-duration) var(--ds-spring-bouncy) both}
.ds-success__check{position:relative;z-index:1;grid-area:1/1;width:56%;height:56%;color:var(--ds-badge-success-ink);stroke-dasharray:1;stroke-dashoffset:1;animation:ds-success-draw ${t.checkDuration}ms var(--ds-easing-enter) ${t.checkDelay}ms forwards}
@keyframes ds-success-pop{from{transform:scale(0)}}
@keyframes ds-success-ring{from{opacity:0.45;transform:scale(1)}to{opacity:0;transform:scale(1.7)}}
@keyframes ds-success-draw{to{stroke-dashoffset:0}}
@media (prefers-reduced-motion:reduce){.ds-success__disc,.ds-success__ring{animation:none}.ds-success__check{animation:none;stroke-dashoffset:0}}
`;
