const tone = (name: string) =>
  `.ds-stat-card__change[data-tone=${name}]{border-color:var(--ds-tag-${name}-border);background:var(--ds-tag-${name}-background);color:var(--ds-tag-${name}-ink)}`;

// The figure lives in its own measuring box, so a narrow card shrinks the number (never below 18px) instead of
// letting it spill out, and the card itself still sizes from its other content
export const statCardCss = `
.ds-stat-card{display:grid;gap:var(--ds-space-xs);align-content:start;padding:var(--ds-space-lg);border-radius:var(--ds-radius-xl);background:var(--ds-color-surface-raised);box-shadow:var(--ds-shadow-sm),0 0 0 1px var(--ds-surface-edge);font-family:var(--ds-font-sans)}
.ds-stat-card__label{font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm);font-weight:var(--ds-font-weight-medium);color:var(--ds-color-text-muted)}
.ds-stat-card__fit{container-type:inline-size;min-width:0}
.ds-stat-card__value{display:block;font-size:clamp(18px,13cqi,var(--ds-text-heading-size));white-space:nowrap;line-height:var(--ds-text-heading-line-height);font-weight:var(--ds-text-heading-weight);letter-spacing:-0.02em;color:var(--ds-color-text);font-variant-numeric:tabular-nums}
.ds-stat-card__footer{display:flex;flex-wrap:wrap;align-items:center;gap:var(--ds-space-sm);margin-top:var(--ds-space-xs)}
.ds-stat-card__change{display:inline-flex;align-items:center;gap:2px;padding:1px var(--ds-space-sm);border:1px solid;border-radius:var(--ds-radius-full);font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm);font-weight:var(--ds-font-weight-medium);font-variant-numeric:tabular-nums}
${['neutral', 'success', 'danger'].map(tone).join('\n')}
.ds-stat-card__caption{font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm);color:var(--ds-color-text-muted)}
`;
