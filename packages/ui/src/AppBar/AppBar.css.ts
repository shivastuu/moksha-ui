// Each side reserves only what it holds and the two grow equally, so a title with room stays exactly centered,
// and on a phone the title gets the space instead of being cut short
const side = 'minmax(max-content, 1fr)';

export const appBarCss = `
.ds-appbar{display:grid;grid-template-columns:${side} minmax(0,auto) ${side};align-items:center;gap:var(--ds-space-sm);box-sizing:border-box;min-height:56px;padding:var(--ds-space-xs) var(--ds-space-sm);background:var(--ds-color-background);box-shadow:inset 0 -1px 0 var(--ds-surface-edge);font-family:var(--ds-font-sans)}
.ds-appbar__side{display:flex;align-items:center;gap:var(--ds-space-xs)}
.ds-appbar__side--end{justify-content:flex-end}
.ds-appbar__titles{display:grid;justify-items:center;min-width:0;text-align:center}
.ds-appbar__title{max-width:100%;overflow:hidden;font-size:var(--ds-font-size-md);line-height:var(--ds-line-height-md);font-weight:var(--ds-font-weight-semibold);color:var(--ds-color-text);white-space:nowrap;text-overflow:ellipsis}
.ds-appbar__subtitle{max-width:100%;overflow:hidden;font-size:var(--ds-font-size-xs);line-height:var(--ds-line-height-xs);color:var(--ds-color-text-muted);white-space:nowrap;text-overflow:ellipsis}
`;
