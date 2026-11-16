const sizes = [
  ['md', 'var(--ds-font-size-xl)'],
  ['lg', 'var(--ds-font-size-2xl)'],
  ['xl', 'var(--ds-font-size-3xl)'],
  ['hero', 'calc(var(--ds-font-size-3xl) * 1.5)'],
]
  .map(([size, fontSize]) => `.ds-amount--${size}{font-size:${fontSize}}`)
  .join('');

// A reel stacks the ten digits and a dot; each row is 1/11 of its height. Lower places roll first.
// Hiding rolls every digit to the dot row
export const rollingAmountCss = `
.ds-amount{display:inline-flex;font-family:var(--ds-font-sans);font-weight:var(--ds-font-weight-semibold);font-variant-numeric:tabular-nums;letter-spacing:-0.035em}
${sizes}
.ds-amount__visual{display:inline-flex;align-items:flex-end;line-height:1.15}
.ds-amount__currency{align-self:flex-start;margin:0.14em 0.12em 0 0;font-size:0.56em;font-weight:var(--ds-font-weight-medium);letter-spacing:0;opacity:0.6}
.ds-amount__digits{display:inline-flex;align-items:flex-end}
.ds-amount__digit{display:inline-block;height:1.15em;overflow:hidden;-webkit-mask-image:linear-gradient(transparent, black 14%, black 86%, transparent);mask-image:linear-gradient(transparent, black 14%, black 86%, transparent)}
.ds-amount__reel{display:flex;flex-direction:column;transform:translateY(calc(var(--ds-row) * -100% / 11));transition:transform var(--ds-spring-smooth-duration) var(--ds-spring-smooth) calc(var(--ds-place) * 25ms)}
.ds-amount__reel>span{height:1.15em;text-align:center}
.ds-amount__fraction{font-size:0.56em;opacity:0.6;margin-bottom:0.08em}
.ds-amount__mark{display:inline-block;max-width:0.6em;overflow:hidden;transition:opacity var(--ds-duration-slow) var(--ds-easing-standard),max-width var(--ds-duration-slow) var(--ds-easing-standard)}
.ds-amount[data-hidden] .ds-amount__mark{opacity:0;max-width:0}
@media (prefers-reduced-motion:no-preference){@starting-style{.ds-amount[data-roll] .ds-amount__reel{transform:translateY(0)}}}
@media (prefers-reduced-motion:reduce){.ds-amount__reel{transition:none}}
`;
