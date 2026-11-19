const sizes = ['sm', 'md', 'lg']
  .map((size) => `.ds-icon-button--${size}{width:var(--ds-icon-button-${size});height:var(--ds-icon-button-${size})}`)
  .join('');

const glassFallback = 'background:var(--ds-color-surface-raised);-webkit-backdrop-filter:none;backdrop-filter:none';

export const iconButtonCss = `
.ds-icon-button{position:relative;isolation:isolate;display:inline-grid;place-items:center;flex-shrink:0;box-sizing:border-box;padding:0;border:var(--ds-border-width-thin) solid transparent;border-radius:var(--ds-radius-full);cursor:pointer;transition:background-color var(--ds-duration-fast) var(--ds-easing-standard),transform var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
${sizes}
.ds-icon-button>svg{width:46%;height:46%}
.ds-icon-button:not(:disabled):active{transform:scale(var(--ds-motion-scale-pressed))}
.ds-icon-button:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}
.ds-icon-button:disabled{opacity:var(--ds-opacity-disabled);cursor:not-allowed}
.ds-icon-button--solid{background:var(--ds-button-primary-fill);box-shadow:var(--ds-button-primary-shadow);color:var(--ds-color-text-on-primary)}
.ds-icon-button--solid::before{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;background:var(--ds-color-primary-pressed);opacity:0;transition:opacity var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
.ds-icon-button--solid:not(:disabled):active::before{opacity:1}
@media (hover:hover){.ds-icon-button--solid:not(:disabled):hover::before{opacity:1}}
.ds-icon-button--soft{background:var(--ds-button-tint);color:var(--ds-color-primary)}
@media (hover:hover){.ds-icon-button--soft:not(:disabled):hover{background:var(--ds-button-secondary-hover)}}
.ds-icon-button--glass{background:var(--ds-color-glass-surface);border-color:var(--ds-color-glass-border);color:var(--ds-color-text);-webkit-backdrop-filter:blur(var(--ds-glass-blur-sm)) saturate(var(--ds-glass-saturation));backdrop-filter:blur(var(--ds-glass-blur-sm)) saturate(var(--ds-glass-saturation))}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.ds-icon-button--glass{${glassFallback}}}
@media (prefers-reduced-transparency:reduce){.ds-icon-button--glass{${glassFallback}}}
.ds-icon-button--ghost{background:transparent;color:var(--ds-color-text-muted)}
@media (hover:hover){.ds-icon-button--ghost:not(:disabled):hover{background:color-mix(in oklab,currentColor calc(var(--ds-opacity-hover) * 100%),transparent)}}
.ds-icon-button--ghost:not(:disabled):active{background:color-mix(in oklab,currentColor calc(var(--ds-opacity-pressed) * 100%),transparent)}
@media (prefers-reduced-motion:reduce){.ds-icon-button{transition:none}.ds-icon-button:not(:disabled):active{transform:none}}
`;
