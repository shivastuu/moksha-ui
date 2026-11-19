const glassFallback =
  'background:var(--ds-color-surface-raised);-webkit-backdrop-filter:none;backdrop-filter:none';

const sizes = ['md', 'lg']
  .map(
    (size) =>
      `.ds-field--${size} .ds-field__control{min-height:var(--ds-field-${size}-height);padding:0 var(--ds-field-${size}-padding-x);font-size:var(--ds-field-${size}-font-size)}`
  )
  .join('');

export const fieldCss = `
.ds-visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.ds-field{display:flex;flex-direction:column;min-width:0;font-family:var(--ds-font-sans);color:var(--ds-color-text)}
.ds-field__label{margin-bottom:var(--ds-field-label-gap);font-size:var(--ds-field-label-font-size);line-height:var(--ds-field-label-line-height);font-weight:var(--ds-field-label-font-weight)}
.ds-field__control{display:flex;align-items:center;gap:var(--ds-field-gap);box-sizing:border-box;border:var(--ds-field-border-width) solid var(--ds-color-border);border-radius:var(--ds-field-radius);background:var(--ds-color-background);box-shadow:var(--ds-shadow-sm);transition:border-color var(--ds-spring-snappy-duration) var(--ds-spring-snappy),box-shadow var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
.ds-field__control:hover:not(:focus-within){border-color:var(--ds-field-border-hover)}
${sizes}
.ds-field__control--filled{background:var(--ds-color-surface);border-color:transparent}
.ds-field__control--glass{background:var(--ds-color-glass-surface);border-color:var(--ds-color-glass-border);-webkit-backdrop-filter:blur(var(--ds-glass-blur-sm)) saturate(var(--ds-glass-saturation));backdrop-filter:blur(var(--ds-glass-blur-sm)) saturate(var(--ds-glass-saturation))}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.ds-field__control--glass{${glassFallback}}}
@media (prefers-reduced-transparency:reduce){.ds-field__control--glass{${glassFallback}}}
.ds-field__control:focus-within{border-color:var(--ds-color-primary);box-shadow:0 0 0 var(--ds-field-halo-width) var(--ds-field-halo);outline:var(--ds-focus-ring-width) solid transparent}
.ds-field--invalid .ds-field__control{border-color:var(--ds-color-danger)}
.ds-field--invalid .ds-field__control:focus-within{box-shadow:0 0 0 var(--ds-field-halo-width) var(--ds-field-halo-danger)}
.ds-field--disabled .ds-field__control{opacity:var(--ds-opacity-disabled);box-shadow:none;cursor:not-allowed}
.ds-field__input{flex:1;min-width:0;align-self:stretch;margin:0;padding:0;border:0;outline:0;background:transparent;color:inherit;font:inherit;caret-color:var(--ds-color-primary)}
.ds-field__input::placeholder{color:var(--ds-color-text-muted);opacity:1}
.ds-field__input:disabled{cursor:not-allowed}
.ds-field__input::-webkit-search-cancel-button{display:none}
.ds-field__affix{display:inline-flex;align-items:center;flex-shrink:0;color:var(--ds-color-text-muted)}
.ds-field__clear{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;width:var(--ds-space-xl);height:var(--ds-space-xl);padding:0;border:0;border-radius:var(--ds-radius-full);background:var(--ds-color-surface);color:var(--ds-color-text-muted);font:inherit;line-height:1;cursor:pointer}
.ds-field__clear:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}
.ds-field__message{margin:var(--ds-field-message-gap) 0 0;font-size:var(--ds-field-message-font-size);line-height:var(--ds-field-message-line-height);color:var(--ds-color-text-muted)}
.ds-field--invalid .ds-field__message{color:var(--ds-color-danger)}
.ds-field__control--shake{animation:ds-shake var(--ds-duration-slow) var(--ds-easing-standard)}
@media (prefers-reduced-motion:reduce){.ds-field__control{transition:none}.ds-field__control--shake{--ds-motion-distance-sm:0px}}
`;
