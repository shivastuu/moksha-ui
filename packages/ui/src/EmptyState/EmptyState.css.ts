import { medallion } from './EmptyState.shared';

const [inner, outer] = medallion.rings as [number, number];
const ring = (size: number, strength: number) =>
  `content:'';position:absolute;inset:${(medallion.size - size) / 2}px;border:1px solid var(--ds-surface-edge);border-radius:var(--ds-radius-full);opacity:${strength}`;

// Rings fade outward, so the medallion reads as lit from its center
export const emptyStateCss = `
.ds-empty{display:grid;justify-items:center;gap:var(--ds-space-sm);padding:var(--ds-space-2xl) var(--ds-space-lg);text-align:center;font-family:var(--ds-font-sans)}
.ds-empty__medallion{position:relative;display:grid;place-items:center;width:${medallion.size}px;height:${medallion.size}px;margin:${(outer - medallion.size) / 2}px 0 calc(${(outer - medallion.size) / 2}px + var(--ds-space-sm));border-radius:var(--ds-radius-full);background:var(--ds-control-selected-fill);box-shadow:0 0 0 1px var(--ds-surface-edge),var(--ds-shadow-sm);color:var(--ds-text-tone-primary);font-size:28px}
.ds-empty__medallion::before{${ring(inner, 1)}}
.ds-empty__medallion::after{${ring(outer, 0.5)}}
.ds-empty__title{margin:0;font-size:var(--ds-text-title-size);line-height:var(--ds-text-title-line-height);font-weight:var(--ds-text-title-weight);color:var(--ds-color-text)}
.ds-empty__description{max-width:36ch;margin:0;font-size:var(--ds-font-size-md);line-height:var(--ds-line-height-md);color:var(--ds-color-text-muted)}
.ds-empty>.ds-button{margin-top:var(--ds-space-md)}
`;
