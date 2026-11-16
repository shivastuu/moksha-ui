import { bankCardFinishes } from './BankCard.shared';

// Sizes inside the card are in cqw (percent of the card's width), so everything scales with the card
const finishes = bankCardFinishes
  .map(
    (finish) =>
      `.ds-bank-card--${finish} .ds-bank-card__face{background:var(--ds-bank-card-${finish}-background);color:var(--ds-bank-card-${finish}-ink)}`
  )
  .join('');

const tilt = (axis: 'x' | 'y') => `calc((var(--ds-card-${axis}, 0.5) - 0.5) * 2 * var(--ds-bank-card-tilt))`;

export const bankCardCss = `
.ds-bank-card{container-type:inline-size;width:100%;max-width:var(--ds-bank-card-max-width);aspect-ratio:1.586;perspective:1000px;font-family:var(--ds-font-sans)}
.ds-bank-card__body{position:relative;width:100%;height:100%;transform-style:preserve-3d;transform:rotateX(calc(-1 * ${tilt('y')})) rotateY(${tilt('x')}) rotateY(var(--ds-card-flip, 0deg));transition:transform var(--ds-spring-smooth-duration) var(--ds-spring-smooth)}
.ds-bank-card[data-flipped]{--ds-card-flip:180deg}
.ds-bank-card__face{position:absolute;inset:0;box-sizing:border-box;display:flex;flex-direction:column;padding:6.5cqw 7cqw;overflow:hidden;isolation:isolate;border-radius:var(--ds-bank-card-radius);box-shadow:var(--ds-shadow-lg);-webkit-backface-visibility:hidden;backface-visibility:hidden;transition:filter var(--ds-duration-slow) var(--ds-easing-standard)}
${finishes}
.ds-bank-card--metal .ds-bank-card__face::after{content:'';position:absolute;inset:0;z-index:-1;background:var(--ds-bank-card-brushed)}
.ds-bank-card__front::before{content:'';position:absolute;inset:0;z-index:-1;background:var(--ds-bank-card-pattern);-webkit-mask-image:radial-gradient(circle at 100% 100%, black, transparent 75%);mask-image:radial-gradient(circle at 100% 100%, black, transparent 75%)}
.ds-bank-card__back{transform:rotateY(180deg);padding:0}
.ds-bank-card__row{display:flex;align-items:center;justify-content:space-between;gap:4cqw}
.ds-bank-card__label{font-size:5cqw;font-weight:var(--ds-font-weight-semibold);letter-spacing:-0.01em}
.ds-bank-card__contactless{width:7cqw;height:7cqw;opacity:0.85}
.ds-bank-card__chip{position:relative;width:13cqw;height:10cqw;margin-top:7cqw;border-radius:1.8cqw;background:var(--ds-bank-card-chip);box-shadow:inset 0 0 0 1px var(--ds-bank-card-chip-line)}
.ds-bank-card__chip::before,.ds-bank-card__chip::after{content:'';position:absolute;inset:32% 0;border-block:1px solid var(--ds-bank-card-chip-line)}
.ds-bank-card__chip::after{inset:0 38%;border-block:0;border-inline:1px solid var(--ds-bank-card-chip-line)}
.ds-bank-card__number{margin-top:auto;font-size:6.4cqw;font-weight:var(--ds-font-weight-medium);letter-spacing:0.08em;font-variant-numeric:tabular-nums;white-space:nowrap}
.ds-bank-card__details{margin-top:4cqw;justify-content:flex-start;gap:9cqw}
.ds-bank-card__field{display:grid;gap:0.6cqw;font-size:4cqw;font-weight:var(--ds-font-weight-semibold);text-transform:uppercase;letter-spacing:0.04em}
.ds-bank-card__caption{font-size:2.6cqw;font-weight:var(--ds-font-weight-medium);letter-spacing:0.12em;text-transform:uppercase;opacity:0.7}
.ds-bank-card__network{margin-left:auto;display:flex;align-items:center;height:9cqw}
.ds-bank-card__stripe{display:block;height:19%;margin-top:9%;background:var(--ds-bank-card-stripe)}
.ds-bank-card__signature{display:flex;align-items:center;justify-content:flex-end;height:15%;margin:7% 7% 0;padding:0 3cqw;border-radius:1cqw;background:var(--ds-bank-card-signature)}
.ds-bank-card__cvv{font-size:4.2cqw;font-weight:var(--ds-font-weight-semibold);font-style:italic;letter-spacing:0.1em;color:var(--ds-bank-card-stripe)}
.ds-bank-card__fine{margin:auto 7% 6.5cqw}
.ds-bank-card__holo,.ds-bank-card__glare,.ds-bank-card__frost{position:absolute;inset:0;pointer-events:none}
.ds-bank-card__holo{background:var(--ds-bank-card-holo);background-size:300% 100%;background-position:calc(var(--ds-card-x, 0.5) * 100%) 0;mix-blend-mode:color-dodge;opacity:0.18;transition:opacity var(--ds-duration-normal) var(--ds-easing-standard)}
.ds-bank-card__glare{inset:auto;width:130%;aspect-ratio:1;left:calc(var(--ds-card-x, 0.5) * 100% - 65%);top:calc(var(--ds-card-y, 0.5) * 100% - 65%);background:var(--ds-bank-card-glare);mix-blend-mode:overlay;opacity:0;transition:opacity var(--ds-duration-normal) var(--ds-easing-standard)}
.ds-bank-card:hover .ds-bank-card__holo{opacity:0.9}
.ds-bank-card:hover .ds-bank-card__glare{opacity:1}
.ds-bank-card__frost{display:grid;place-items:center;background:var(--ds-bank-card-frost);-webkit-backdrop-filter:blur(1.5px) saturate(0.6);backdrop-filter:blur(1.5px) saturate(0.6);opacity:0;transition:opacity var(--ds-duration-slow) var(--ds-easing-standard)}
.ds-bank-card__frozen{display:flex;align-items:center;gap:1.6cqw;padding:1.8cqw 3.6cqw;border-radius:var(--ds-radius-full);background:var(--ds-bank-card-frozen-pill);color:var(--ds-bank-card-frozen-text);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);font-size:3.6cqw;font-weight:var(--ds-font-weight-semibold);letter-spacing:0.02em}
.ds-bank-card__snowflake{width:4.4cqw;height:4.4cqw}
.ds-bank-card[data-frozen] .ds-bank-card__face{filter:saturate(0.35)}
.ds-bank-card[data-frozen] .ds-bank-card__frost{opacity:1}
@media (prefers-reduced-motion:reduce){.ds-bank-card__body{transform:rotateY(var(--ds-card-flip, 0deg));transition:none}}
`;
