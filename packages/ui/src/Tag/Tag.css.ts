const tones = ['neutral', 'primary', 'success', 'warning', 'danger']
  .map(
    (tone) =>
      `.ds-tag--${tone}{background:var(--ds-tag-${tone}-background);border-color:var(--ds-tag-${tone}-border);color:var(--ds-tag-${tone}-ink)}`
  )
  .join('');

export const tagCss = `
.ds-tag{display:inline-flex;align-items:center;gap:var(--ds-space-xs);box-sizing:border-box;border:var(--ds-border-width-thin) solid transparent;border-radius:var(--ds-radius-full);font-family:var(--ds-font-sans);font-weight:var(--ds-font-weight-medium);white-space:nowrap}
.ds-tag--sm{height:22px;padding:0 var(--ds-space-sm);font-size:var(--ds-font-size-xs)}
.ds-tag--md{height:28px;padding:0 calc(var(--ds-space-sm) + 2px);font-size:var(--ds-font-size-sm)}
${tones}
.ds-tag__dot{width:6px;height:6px;border-radius:var(--ds-radius-full);background:currentColor}
.ds-tag>svg{width:1.1em;height:1.1em}
`;
