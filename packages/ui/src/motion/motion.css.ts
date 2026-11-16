export const motionCss = `
.ds-motion{animation-fill-mode:both;animation-duration:var(--ds-duration-normal);animation-timing-function:var(--ds-easing-enter)}
.ds-motion--fade{animation-name:ds-fade}
.ds-motion--fade-up{animation-name:ds-fade-up}
.ds-motion--fade-down{animation-name:ds-fade-down}
.ds-motion--scale-in{animation-name:ds-scale-in}
.ds-motion--slide-up{animation-name:ds-slide-up}
@keyframes ds-fade{from{opacity:0}}
@keyframes ds-fade-up{from{opacity:0;transform:translateY(var(--ds-motion-distance-md))}}
@keyframes ds-fade-down{from{opacity:0;transform:translateY(calc(var(--ds-motion-distance-md) * -1))}}
@keyframes ds-scale-in{from{opacity:0;transform:scale(var(--ds-motion-scale-enter))}}
@keyframes ds-slide-up{from{opacity:0;transform:translateY(var(--ds-motion-distance-lg))}}
@keyframes ds-shake{20%{transform:translateX(var(--ds-motion-distance-sm))}40%{transform:translateX(calc(var(--ds-motion-distance-sm) * -1))}60%{transform:translateX(calc(var(--ds-motion-distance-sm) / 2))}80%{transform:translateX(calc(var(--ds-motion-distance-sm) / -2))}}
@keyframes ds-pop{from{opacity:0.4;transform:scale(var(--ds-motion-scale-pop))}}
@media (prefers-reduced-motion:reduce){.ds-motion{animation-name:ds-fade}}
`;
