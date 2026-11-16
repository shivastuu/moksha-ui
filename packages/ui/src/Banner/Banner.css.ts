const tones = [
  ['info', 'primary'],
  ['success', 'success'],
  ['warning', 'warning'],
  ['danger', 'danger'],
]
  .map(
    ([tone, color]) =>
      `.ds-banner--${tone}{--ds-banner-accent:var(--ds-color-${color});background:var(--ds-color-${color}-subtle)}`
  )
  .join('');

const textButton =
  'padding:0;border:0;background:transparent;color:inherit;font:inherit;cursor:pointer;border-radius:var(--ds-radius-sm)';

export const bannerCss = `
.ds-banner{display:flex;align-items:flex-start;gap:var(--ds-space-md);box-sizing:border-box;padding:var(--ds-banner-padding);padding-left:calc(var(--ds-banner-padding) + var(--ds-banner-accent-width));border-radius:var(--ds-banner-radius);box-shadow:inset var(--ds-banner-accent-width) 0 0 var(--ds-banner-accent);color:var(--ds-color-text);font-family:var(--ds-font-sans);font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm)}
${tones}
.ds-banner__body{display:grid;gap:var(--ds-space-xs);flex:1;min-width:0;justify-items:start}
.ds-banner__title{margin:0;font-weight:var(--ds-font-weight-semibold)}
.ds-banner__action{${textButton};margin-top:var(--ds-space-xs);font-weight:var(--ds-font-weight-semibold);text-decoration:underline;text-underline-offset:2px}
.ds-banner__dismiss{${textButton};flex-shrink:0;width:var(--ds-space-xl);height:var(--ds-space-xl);font-size:var(--ds-font-size-lg);line-height:1}
.ds-banner__action:focus-visible,.ds-banner__dismiss:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}
`;
