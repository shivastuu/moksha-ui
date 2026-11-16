import { colors, type ColorScheme } from '@shivastu/tokens';
import { buttonCss } from '../Button/Button.css';

const kebab = (name: string) => name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

const schemeCss = (scheme: ColorScheme) =>
  `[data-ds-scheme=${scheme}]{color-scheme:${scheme};${Object.entries(colors[scheme])
    .map(([name, value]) => `--ds-color-${kebab(name)}:${value};`)
    .join('')}}`;

export const globalCss = schemeCss('light') + schemeCss('dark') + buttonCss;
