export const cardStackCss = `
.ds-card-stack{position:relative;display:grid;margin:0;padding:0;list-style:none}
.ds-card-stack__card{position:relative;grid-area:1/1;transform-origin:top center;transition:transform var(--ds-spring-smooth-duration) var(--ds-spring-smooth),filter var(--ds-duration-normal) var(--ds-easing-standard)}
.ds-card-stack__pick{position:absolute;inset:0;z-index:1;width:100%;padding:0;border:0;border-radius:var(--ds-bank-card-radius);background:transparent;cursor:pointer}
.ds-card-stack__pick:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}
@media (prefers-reduced-motion:reduce){.ds-card-stack__card{transition:none}}
`;
