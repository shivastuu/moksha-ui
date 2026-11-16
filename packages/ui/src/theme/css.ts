import { springCurve, type ColorScheme, type ThemeDefinition } from '@shivastu/tokens';
import { bankCardCss } from '../BankCard/BankCard.css';
import { rollingAmountCss } from '../RollingAmount/RollingAmount.css';
import { bankCardColors, bankCardFinishes } from '../BankCard/BankCard.shared';
import { buttonDepth } from '../Button/Button.shared';
import { fieldColors } from '../TextField/TextField.shared';
import { dialogColors } from '../Dialog/Dialog.shared';
import { snackbarColors } from '../Snackbar/Snackbar.shared';
import { iconButtonCss } from '../IconButton/IconButton.css';
import { buttonCss } from '../Button/Button.css';
import { fieldCss } from '../TextField/TextField.css';
import { otpCss } from '../OtpField/OtpField.css';
import { surfaceCss } from '../Surface/Surface.css';
import { motionCss } from '../motion/motion.css';
import { bannerCss } from '../Banner/Banner.css';
import { bannerColors, bannerTones } from '../Banner/Banner.shared';
import { promoCss } from '../PromoBanner/PromoBanner.css';
import { promoColors } from '../PromoBanner/PromoBanner.shared';
import { dialogCss } from '../Dialog/Dialog.css';
import { snackbarCss } from '../Snackbar/Snackbar.css';

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
  const { button, field, otp, modal, snackbar, banner, promo, bankCard, iconButton } = components;
  const card = bankCardColors(themes.light.colors);
  const label = typography.textStyles[field.labelStyle];
  const message = typography.textStyles[field.messageStyle];

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
    vars('motion-distance', motion.distance, px),
    vars('motion-scale', motion.scale),
    ...Object.entries(motion.spring).map(([name, spring]) => {
      const { easing, duration } = springCurve(spring);
      return `--ds-spring-${name}:${easing};--ds-spring-${name}-duration:${duration}ms;`;
    }),
    vars('glass-blur', glass.blur, px),
    `--ds-glass-saturation:${glass.saturation};`,
    vars('z-index', zIndex),
    `--ds-button-radius:${button.radius}px;--ds-button-border-width:${button.borderWidth}px;--ds-button-gap:${button.gap}px;--ds-button-font-weight:${typography.fontWeight[button.fontWeight]};`,
    ...Object.entries(button.sizes).map(([size, m]) => vars(`button-${size}`, m, px)),
    `--ds-field-radius:${field.radius}px;--ds-field-halo-width:${field.halo}px;--ds-field-border-width:${field.borderWidth}px;--ds-field-gap:${field.gap}px;--ds-field-label-gap:${field.labelGap}px;--ds-field-message-gap:${field.messageGap}px;`,
    `--ds-field-label-font-size:${label.fontSize}px;--ds-field-label-line-height:${label.lineHeight}px;--ds-field-label-font-weight:${typography.fontWeight[label.fontWeight]};`,
    `--ds-field-message-font-size:${message.fontSize}px;--ds-field-message-line-height:${message.lineHeight}px;`,
    ...Object.entries(field.sizes).map(([size, m]) => vars(`field-${size}`, m, px)),
    vars('otp', otp, px),
    vars('modal', modal, px),
    `--ds-snackbar-radius:${snackbar.radius}px;--ds-snackbar-padding:${snackbar.padding}px;--ds-snackbar-max-width:${snackbar.maxWidth}px;--ds-snackbar-offset:${snackbar.offset}px;`,
    `--ds-banner-radius:${banner.radius}px;--ds-banner-padding:${banner.padding}px;--ds-banner-gap:${banner.gap}px;--ds-banner-icon-size:${banner.iconSize}px;`,
    vars('promo', promo, px),
    vars('icon-button', iconButton.sizes, px),
    `--ds-bank-card-radius:${bankCard.radius}px;--ds-bank-card-padding:${bankCard.padding}px;--ds-bank-card-max-width:${bankCard.maxWidth}px;--ds-bank-card-tilt:${bankCard.tilt}deg;`,
    // A card is a physical object: its colors come from the light scheme in both schemes
    ...bankCardFinishes.map((finish) => vars(`bank-card-${finish}`, card[finish])),
    vars('bank-card', { chip: card.chip, chipLine: card.chipLine, holo: card.holo, glare: card.glare, stripe: card.stripe, signature: card.signature, frost: card.frost, frozenPill: card.frozenPill, frozenText: card.frozenText, pattern: card.pattern, brushed: card.brushed }),
  ].join('');

  const scheme = (name: ColorScheme) =>
    `[data-ds-theme="${id}"][data-ds-scheme=${name}]{color-scheme:${name};${vars('color', themes[name].colors)}${vars(
      'shadow',
      themes[name].shadows
    )}${vars('button', buttonDepth(themes[name].colors))}${vars('field', fieldColors(themes[name].colors))}${vars('modal', dialogColors(themes[name].colors))}${vars('snackbar', snackbarColors(themes[name].colors))}${bannerTones.map((tone) => vars(`banner-${tone}`, bannerColors(tone, themes[name].colors, banner.tint))).join('')}${vars(
      'promo',
      promoColors(themes[name].colors)
    )}}`;

  return `[data-ds-theme="${id}"]{${shared}}${scheme('light')}${scheme('dark')}`;
}

/** Component styles. They only read CSS variables, so they are the same for every theme */
export const componentCss =
  motionCss + buttonCss + surfaceCss + fieldCss + otpCss + bannerCss + promoCss + dialogCss + snackbarCss + bankCardCss + rollingAmountCss + iconButtonCss;
