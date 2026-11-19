export const fileUploadCss = `
.ds-upload{display:grid;gap:var(--ds-space-sm);font-family:var(--ds-font-sans)}
.ds-upload__label{font-size:var(--ds-field-label-font-size);line-height:var(--ds-field-label-line-height);font-weight:var(--ds-field-label-font-weight);color:var(--ds-color-text)}
.ds-upload__zone{display:grid;justify-items:center;gap:var(--ds-space-xs);padding:var(--ds-space-xl) var(--ds-space-lg);border:1.5px dashed var(--ds-control-box-border);border-radius:var(--ds-radius-xl);background:var(--ds-color-surface);text-align:center;transition:border-color var(--ds-duration-fast) var(--ds-easing-standard),background-color var(--ds-duration-fast) var(--ds-easing-standard),transform var(--ds-spring-snappy-duration) var(--ds-spring-snappy)}
.ds-upload__zone[data-dragging]{border-color:var(--ds-control-indicator);background:var(--ds-control-selected-fill);transform:scale(1.01)}
.ds-upload__zone[data-disabled]{opacity:var(--ds-opacity-disabled)}
.ds-upload__icon{display:grid;place-items:center;width:48px;height:48px;margin-bottom:var(--ds-space-xs);border-radius:var(--ds-radius-full);background:var(--ds-control-selected-fill);box-shadow:0 0 0 1px var(--ds-surface-edge);color:var(--ds-text-tone-primary);font-size:22px;transition:transform var(--ds-spring-bouncy-duration) var(--ds-spring-bouncy)}
.ds-upload__zone[data-dragging] .ds-upload__icon{transform:translateY(-3px)}
.ds-upload__prompt{margin:0;font-size:var(--ds-font-size-md);line-height:var(--ds-line-height-md);color:var(--ds-color-text)}
.ds-upload__browse{padding:0;border:0;background:none;color:var(--ds-text-tone-primary);font:inherit;font-weight:var(--ds-font-weight-semibold);text-decoration-line:underline;text-decoration-thickness:1px;text-underline-offset:0.22em;text-decoration-color:transparent;cursor:pointer;transition:text-decoration-color var(--ds-duration-fast) var(--ds-easing-standard)}
@media (hover:hover){.ds-upload__browse:hover:not(:disabled){text-decoration-color:currentColor}}
.ds-upload__browse:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset);border-radius:var(--ds-radius-sm)}
.ds-upload__hint{margin:0;font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm);color:var(--ds-color-text-muted)}
.ds-upload__errors{display:grid;gap:2px;margin:0;padding:0;list-style:none;font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm);color:var(--ds-text-tone-danger)}
.ds-upload__files{display:grid;gap:var(--ds-space-sm);margin:0;padding:0;list-style:none}
.ds-upload__file{display:flex;align-items:center;gap:var(--ds-space-md);padding:var(--ds-space-sm) var(--ds-space-sm) var(--ds-space-sm) var(--ds-space-md);border-radius:var(--ds-radius-lg);background:var(--ds-color-surface-raised);box-shadow:var(--ds-shadow-sm),0 0 0 1px var(--ds-surface-edge);animation:ds-fade-up var(--ds-spring-smooth-duration) var(--ds-spring-smooth)}
.ds-upload__badge{display:grid;place-items:center;flex-shrink:0;width:40px;height:40px;border-radius:var(--ds-radius-md);background:var(--ds-tag-primary-background);box-shadow:inset 0 0 0 1px var(--ds-tag-primary-border);color:var(--ds-tag-primary-ink);font-size:10px;font-weight:var(--ds-font-weight-semibold);letter-spacing:0.04em}
.ds-upload__meta{display:grid;flex:1;min-width:0}
.ds-upload__name{overflow:hidden;font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm);font-weight:var(--ds-font-weight-medium);color:var(--ds-color-text);white-space:nowrap;text-overflow:ellipsis}
.ds-upload__size{font-size:var(--ds-font-size-xs);line-height:var(--ds-line-height-xs);color:var(--ds-color-text-muted);font-variant-numeric:tabular-nums}
.ds-upload__remove{display:grid;place-items:center;flex-shrink:0;width:32px;height:32px;padding:0;border:0;border-radius:var(--ds-radius-full);background:transparent;color:var(--ds-color-text-muted);font:inherit;font-size:18px;line-height:1;cursor:pointer}
.ds-upload__remove:focus-visible{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}
@media (prefers-reduced-motion:reduce){.ds-upload__zone,.ds-upload__icon{transition:none}.ds-upload__file{animation:none}}
`;
