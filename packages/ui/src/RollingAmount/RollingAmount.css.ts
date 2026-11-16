const sizes = [
  ['md', 'xl'],
  ['lg', '2xl'],
  ['xl', '3xl'],
]
  .map(([size, token]) => `.ds-amount--${size}{font-size:var(--ds-font-size-${token})}`)
  .join('');

// A reel is the ten digits stacked; each digit is 10% of its height. Lower places roll first
export const rollingAmountCss = `
.ds-amount{display:inline-flex;font-family:var(--ds-font-sans);font-weight:var(--ds-font-weight-semibold);font-variant-numeric:tabular-nums;letter-spacing:-0.02em}
${sizes}
.ds-amount__visual{display:inline-flex;align-items:baseline;line-height:1.15}
.ds-amount__currency{margin-right:0.18em;font-weight:var(--ds-font-weight-medium);opacity:0.75}
.ds-amount__digits{display:inline-flex;transition:filter var(--ds-duration-slow) var(--ds-easing-standard),opacity var(--ds-duration-slow) var(--ds-easing-standard)}
.ds-amount__digit{display:inline-block;height:1.15em;overflow:hidden;-webkit-mask-image:linear-gradient(transparent, black 14%, black 86%, transparent);mask-image:linear-gradient(transparent, black 14%, black 86%, transparent)}
.ds-amount__reel{display:flex;flex-direction:column;transform:translateY(calc(var(--ds-digit) * -10%));transition:transform var(--ds-spring-smooth-duration) var(--ds-spring-smooth) calc(var(--ds-place) * 25ms)}
.ds-amount__reel>span{height:1.15em}
.ds-amount[data-hidden] .ds-amount__digits{filter:blur(0.3em);opacity:0.7}
@media (prefers-reduced-motion:no-preference){@starting-style{.ds-amount[data-roll] .ds-amount__reel{transform:translateY(0)}}}
@media (prefers-reduced-motion:reduce){.ds-amount__reel{transition:none}}
`;
