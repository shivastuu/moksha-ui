import { breathe } from '../motion/motion.css';

// Blocks breathe together on the theme's rhythm, opacity only
export const skeletonCss = `
.ds-skeleton-group{display:grid;gap:var(--ds-space-sm)}
.ds-skeleton{display:block;max-width:100%;border-radius:var(--ds-radius-sm);background:var(--ds-skeleton-base);animation:${breathe()}}
.ds-skeleton--round{border-radius:var(--ds-radius-full)}
@media (prefers-reduced-motion:reduce){.ds-skeleton{animation:none}}
`;
