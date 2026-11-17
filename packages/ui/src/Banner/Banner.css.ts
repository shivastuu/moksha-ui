import { bannerTones } from './Banner.shared';

// Each tone's colors are CSS variables per theme and scheme (see theme/css.ts)
const tones = bannerTones
  .map(
    (tone) =>
      `.ds-banner--${tone}{--ds-banner-accent:var(--ds-banner-${tone}-accent);--ds-banner-background:var(--ds-banner-${tone}-background);--ds-banner-border:var(--ds-banner-${tone}-border);--ds-banner-glyph:var(--ds-banner-${tone}-glyph)}`
  )
  .join('');

const roundButton =
  'flex:none;display:grid;place-items:center;padding:0;border:0;border-radius:var(--ds-radius-full);cursor:pointer';

export const bannerCss = `
.ds-banner{display:flex;align-items:flex-start;gap:var(--ds-banner-gap);box-sizing:border-box;padding:var(--ds-banner-padding);border:var(--ds-border-width-thin) solid var(--ds-banner-border);border-radius:var(--ds-banner-radius);background:var(--ds-banner-background);color:var(--ds-color-text);font-family:var(--ds-font-sans);font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm)}
${tones}
.ds-banner__icon{${roundButton};cursor:default;width:var(--ds-banner-icon-size);height:var(--ds-banner-icon-size);background:var(--ds-banner-accent);color:var(--ds-banner-glyph)}
.ds-banner__icon svg,.ds-banner__dismiss svg{width:56%;height:56%}
.ds-banner__main{flex:1;min-width:0;display:flex;flex-wrap:wrap;align-items:center;gap:var(--ds-space-sm) var(--ds-banner-gap);min-height:var(--ds-banner-icon-size)}
.ds-banner__body{flex:1 1 12rem;min-width:0}
.ds-banner__title{margin:0;font-size:var(--ds-font-size-md);line-height:var(--ds-line-height-md);font-weight:var(--ds-font-weight-semibold)}
.ds-banner__title+.ds-banner__text{color:var(--ds-color-text-muted)}
.ds-banner__action{${roundButton};min-height:var(--ds-button-sm-height);padding:0 var(--ds-button-sm-padding-x);background:var(--ds-color-surface-inverse);color:var(--ds-color-text-inverse);font:inherit;font-weight:var(--ds-font-weight-semibold);white-space:nowrap}
.ds-banner__dismiss{${roundButton};width:var(--ds-banner-icon-size);height:var(--ds-banner-icon-size);background:transparent;color:var(--ds-color-text-muted)}
.ds-banner__action:focus-visible,.ds-banner__dismiss:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}
`;
