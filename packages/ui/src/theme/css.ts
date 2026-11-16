import { foundations, themes, type ColorScheme } from '@shivastu/tokens';
import { buttonCss } from '../Button/Button.css';

const kebab = (name: string) => name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

const px = (value: string | number) => `${value}px`;

const ms = (value: string | number) => `${value}ms`;

const vars = (
  prefix: string,
  values: Record<string, string | number>,
  unit: (value: string | number) => string = String
) =>
  Object.entries(values)
    .map(([name, value]) => `--ds-${prefix}-${kebab(name)}:${unit(value)};`)
    .join('');

const { typography, space, radius, borderWidth, opacity, focusRing, motion, zIndex } = foundations;

const sharedVars = [
  `--ds-font-sans:${typography.fontFamily.web};`,
  vars('font-weight', typography.fontWeight),
  vars('font-size', typography.fontSize, px),
  vars('line-height', typography.lineHeight, px),
  vars('letter-spacing', typography.letterSpacing, px),
  vars('space', space, px),
  vars('radius', radius, px),
  vars('border-width', borderWidth, px),
  vars('opacity', opacity),
  vars('focus-ring', focusRing, px),
  vars('duration', motion.duration, ms),
  vars('easing', motion.easing),
  vars('z-index', zIndex),
].join('');

const schemeVars = (scheme: ColorScheme) =>
  `[data-ds-scheme=${scheme}]{color-scheme:${scheme};${vars('color', { ...themes[scheme].colors })}${vars(
    'shadow',
    themes[scheme].shadows
  )}}`;

export const globalCss = `[data-ds-scheme]{${sharedVars}}${schemeVars('light')}${schemeVars('dark')}${buttonCss}`;
