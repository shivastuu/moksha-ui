import type { ColorScheme, ThemeDefinition } from '@shivastu/tokens';
import { buttonCss } from '../Button/Button.css';
import { surfaceCss } from '../Surface/Surface.css';

const kebab = (name: string) => name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

const px = (value: string | number) => `${value}px`;

const ms = (value: string | number) => `${value}ms`;

const vars = (
  prefix: string,
  values: object,
  unit: (value: string | number) => string = String
) =>
  Object.entries(values)
    .map(([name, value]) => `--ds-${prefix}-${kebab(name)}:${unit(value)};`)
    .join('');

/** Short stable id for a theme, used to scope its CSS variables */
export function themeId(definition: ThemeDefinition) {
  const json = JSON.stringify(definition);
  let hash = 5381;
  for (let i = 0; i < json.length; i += 1) {
    hash = ((hash << 5) + hash + json.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}

/** Every token of `definition` as CSS variables, scoped to `[data-ds-theme="id"]` */
export function themeCss(definition: ThemeDefinition, id: string) {
  const { foundations, components, themes } = definition;
  const { typography, space, radius, borderWidth, opacity, focusRing, motion, glass, zIndex } = foundations;
  const { button } = components;

  const shared = [
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
    vars('glass-blur', glass.blur, px),
    `--ds-glass-saturation:${glass.saturation};`,
    vars('z-index', zIndex),
    `--ds-button-radius:${button.radius}px;--ds-button-border-width:${button.borderWidth}px;--ds-button-gap:${button.gap}px;--ds-button-font-weight:${typography.fontWeight[button.fontWeight]};`,
    ...Object.entries(button.sizes).map(([size, m]) => vars(`button-${size}`, m, px)),
  ].join('');

  const scheme = (name: ColorScheme) =>
    `[data-ds-theme="${id}"][data-ds-scheme=${name}]{color-scheme:${name};${vars('color', themes[name].colors)}${vars(
      'shadow',
      themes[name].shadows
    )}}`;

  return `[data-ds-theme="${id}"]{${shared}}${scheme('light')}${scheme('dark')}`;
}

/** Component styles. They only read CSS variables, so they are the same for every theme */
export const componentCss = buttonCss + surfaceCss;
