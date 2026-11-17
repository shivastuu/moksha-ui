const textOnBrand = 'max-width:62%;margin:0';

// The art is a drawing, so its sizes are fixed pixels
export const promoCss = `
.ds-promo{position:relative;overflow:hidden;isolation:isolate;display:grid;gap:var(--ds-space-xs);justify-items:start;align-content:start;box-sizing:border-box;min-height:var(--ds-promo-min-height);padding:var(--ds-promo-padding);border-radius:var(--ds-promo-radius);background:var(--ds-promo-background);color:var(--ds-promo-ink);font-family:var(--ds-font-sans)}
.ds-promo__eyebrow{font-size:var(--ds-font-size-xs);line-height:var(--ds-line-height-xs);font-weight:var(--ds-font-weight-semibold);letter-spacing:var(--ds-letter-spacing-wide);text-transform:uppercase}
.ds-promo__title{${textOnBrand};font-size:var(--ds-font-size-xl);line-height:var(--ds-line-height-xl);font-weight:var(--ds-font-weight-semibold)}
.ds-promo__text{${textOnBrand};font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm)}
.ds-promo__action{margin-top:var(--ds-space-sm);min-height:var(--ds-button-sm-height);padding:0 var(--ds-button-sm-padding-x);border:0;border-radius:var(--ds-radius-full);background:var(--ds-promo-ink);color:var(--ds-promo-action-ink);font:inherit;font-size:var(--ds-font-size-sm);font-weight:var(--ds-font-weight-semibold);cursor:pointer}
.ds-promo__art{position:absolute;right:0;bottom:0;z-index:-1;pointer-events:none}
.ds-promo__card{position:relative;display:block;width:150px;height:96px;margin:0 -14px -22px 0;border:var(--ds-border-width-thin) solid var(--ds-promo-art-border);border-radius:var(--ds-radius-lg);background:var(--ds-promo-art-fill);transform:rotate(-12deg);-webkit-backdrop-filter:blur(var(--ds-glass-blur-sm));backdrop-filter:blur(var(--ds-glass-blur-sm))}
.ds-promo__card::before,.ds-promo__card::after{content:'';position:absolute;left:16px;background:var(--ds-promo-art-detail)}
.ds-promo__card::before{top:22px;width:26px;height:20px;border-radius:5px}
.ds-promo__card::after{bottom:18px;width:84px;height:6px;border-radius:3px}
.ds-promo__dismiss{position:absolute;top:var(--ds-space-sm);right:var(--ds-space-sm);display:grid;place-items:center;width:var(--ds-space-2xl);height:var(--ds-space-2xl);padding:0;border:0;border-radius:var(--ds-radius-full);background:transparent;color:inherit;cursor:pointer}
.ds-promo__dismiss svg{width:56%;height:56%}
.ds-promo__dismiss:hover{background:var(--ds-promo-art-fill)}
.ds-promo__action:focus-visible,.ds-promo__dismiss:focus-visible{outline:var(--ds-focus-ring-width) solid currentColor;outline-offset:var(--ds-focus-ring-offset)}
`;
