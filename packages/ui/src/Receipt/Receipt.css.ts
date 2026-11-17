import { receipt } from './Receipt.shared';

const notch = (side: 'left' | 'right') =>
  `.ds-receipt__tear::${side === 'left' ? 'before' : 'after'}{content:'';position:absolute;top:50%;${side}:-${receipt.notch}px;width:${receipt.notch * 2}px;height:${receipt.notch * 2}px;border-radius:var(--ds-radius-full);background:var(--ds-receipt-notch,var(--ds-color-background));box-shadow:inset ${side === 'left' ? '-1px' : '1px'} 0 0 var(--ds-surface-edge);transform:translateY(-50%)}`;

// A ticket: the top holds the status and amount, a dashed tear line with two notches, then the details
export const receiptCss = `
.ds-receipt{display:grid;gap:var(--ds-space-lg);font-family:var(--ds-font-sans)}
.ds-receipt__card{overflow:hidden;border-radius:var(--ds-radius-xl);background:var(--ds-color-surface-raised);box-shadow:var(--ds-shadow-md),0 0 0 1px var(--ds-surface-edge)}
.ds-receipt__top{display:grid;justify-items:center;gap:var(--ds-space-xs);padding:var(--ds-space-xl) var(--ds-space-lg) var(--ds-space-lg);text-align:center}
.ds-receipt__status{display:grid;place-items:center;width:${receipt.status}px;height:${receipt.status}px;margin-bottom:var(--ds-space-sm);border-radius:var(--ds-radius-full);font-size:28px}
.ds-receipt__status--pending{background:var(--ds-tag-warning-background);box-shadow:inset 0 0 0 1px var(--ds-tag-warning-border);color:var(--ds-tag-warning-ink)}
.ds-receipt__status--failed{background:var(--ds-badge-danger-background);box-shadow:inset 0 0 0 1px var(--ds-badge-danger-edge);color:var(--ds-badge-danger-ink);animation:ds-pop var(--ds-spring-bouncy-duration) var(--ds-spring-bouncy)}
.ds-receipt__title{margin:var(--ds-space-xs) 0 0;font-size:var(--ds-font-size-md);line-height:var(--ds-line-height-md);font-weight:var(--ds-font-weight-medium);color:var(--ds-color-text)}
.ds-receipt__subtitle{margin:0;font-size:var(--ds-font-size-sm);line-height:var(--ds-line-height-sm);color:var(--ds-color-text-muted)}
.ds-receipt__tear{position:relative;height:${receipt.notch * 2}px}
.ds-receipt__tear>span{position:absolute;top:50%;right:${receipt.notch + 8}px;left:${receipt.notch + 8}px;border-top:1.5px dashed var(--ds-color-border)}
${notch('left')}
${notch('right')}
.ds-receipt__details{padding-bottom:var(--ds-space-sm)}
.ds-receipt__actions{display:flex;justify-content:center;gap:var(--ds-space-sm)}
@media (prefers-reduced-motion:reduce){.ds-receipt__status--failed{animation:none}}
`;
