export const skeletonCss = `
.ds-skeleton-group{display:grid;gap:var(--ds-space-sm)}
.ds-skeleton{display:block;max-width:100%;border-radius:var(--ds-radius-sm);background:linear-gradient(90deg, var(--ds-skeleton-base) 30%, var(--ds-skeleton-shine) 50%, var(--ds-skeleton-base) 70%) var(--ds-skeleton-base);background-size:250% 100%;animation:ds-shimmer 1.4s var(--ds-easing-standard) infinite}
.ds-skeleton--round{border-radius:var(--ds-radius-full)}
@keyframes ds-shimmer{from{background-position:100% 0}to{background-position:0 0}}
@media (prefers-reduced-motion:reduce){.ds-skeleton{animation:none;background:var(--ds-skeleton-base)}}
`;
