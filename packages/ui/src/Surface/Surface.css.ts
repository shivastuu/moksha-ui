const glassFallback =
  'background:var(--ds-color-surface-raised);-webkit-backdrop-filter:none;backdrop-filter:none';

export const surfaceCss = `
.ds-surface{box-sizing:border-box;color:var(--ds-color-text)}
.ds-surface--solid{background:var(--ds-color-surface);border:var(--ds-border-width-thin) solid var(--ds-color-border)}
.ds-surface--raised{background:var(--ds-color-surface-raised)}
.ds-surface--glass{background:var(--ds-color-glass-surface);border:var(--ds-border-width-thin) solid var(--ds-color-glass-border);-webkit-backdrop-filter:blur(var(--ds-surface-blur)) saturate(var(--ds-glass-saturation));backdrop-filter:blur(var(--ds-surface-blur)) saturate(var(--ds-glass-saturation))}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.ds-surface--glass{${glassFallback}}}
@media (prefers-reduced-transparency:reduce){.ds-surface--glass{${glassFallback}}}
`;
