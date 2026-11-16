import { tracking } from './Text.shared';

const styles = ['display', 'heading', 'title', 'body', 'bodySmall', 'label', 'caption'] as const;
const kebab = (name: string) => name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

// Sizes come from the theme's text styles as CSS variables (see theme/css.ts), so createTheme changes them
const variants = styles
  .map(
    (name) =>
      `.ds-text--${kebab(name)}{font-size:var(--ds-text-${kebab(name)}-size);line-height:var(--ds-text-${kebab(name)}-line-height);font-weight:var(--ds-text-${kebab(name)}-weight);letter-spacing:${tracking[name] ?? 0}em}`
  )
  .join('');

const toneRules = ['default', 'muted', 'primary', 'success', 'warning', 'danger']
  .map((tone) => `.ds-text--tone-${tone}{color:var(--ds-text-tone-${tone})}`)
  .join('');

export const textCss = `
.ds-text{margin:0;font-family:var(--ds-font-sans)}
${variants}
${toneRules}
.ds-text--clamp{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}
`;
