const sizes = ['sm', 'md', 'lg', 'xl']
  .map((size) => `.ds-avatar--${size}{width:var(--ds-avatar-${size});height:var(--ds-avatar-${size});font-size:calc(var(--ds-avatar-${size}) * 0.38)}`)
  .join('');

export const avatarCss = `
.ds-avatar{position:relative;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;box-sizing:border-box;border-radius:var(--ds-radius-full);box-shadow:inset 0 0 0 1px var(--ds-avatar-edge);font-family:var(--ds-font-sans);font-weight:var(--ds-font-weight-semibold);letter-spacing:0.01em;user-select:none}
${sizes}
.ds-avatar__photo{width:100%;height:100%;border-radius:inherit;object-fit:cover}
.ds-avatar__status{position:absolute;right:0;bottom:0;width:28%;height:28%;border-radius:var(--ds-radius-full);box-shadow:0 0 0 2px var(--ds-color-background)}
.ds-avatar__status--online{background:var(--ds-color-success)}
.ds-avatar__status--busy{background:var(--ds-color-danger)}
.ds-avatar__status--offline{background:var(--ds-color-text-muted)}
.ds-avatar-group{display:inline-flex;align-items:center}
.ds-avatar-group>.ds-avatar{box-shadow:0 0 0 2px var(--ds-color-background)}
.ds-avatar-group>.ds-avatar+.ds-avatar{margin-left:-0.28em}
.ds-avatar-group--sm{font-size:var(--ds-avatar-sm)}.ds-avatar-group--md{font-size:var(--ds-avatar-md)}.ds-avatar-group--lg{font-size:var(--ds-avatar-lg)}.ds-avatar-group--xl{font-size:var(--ds-avatar-xl)}
.ds-avatar--more{background:var(--ds-color-surface);color:var(--ds-color-text-muted)}
@media (forced-colors:active){.ds-avatar__status{background:CanvasText}}
`;
