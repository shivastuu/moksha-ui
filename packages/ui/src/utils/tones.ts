import { alpha, ensureContrast, hexToOklch, mix, type SemanticColors } from '@shivastu/tokens';

export type Tone = 'primary' | 'success' | 'warning' | 'danger';

export const tones: Tone[] = ['primary', 'success', 'warning', 'danger'];

/** Tone colors darkened or lightened just enough to read as body text on the background (WCAG AA, 4.5:1) */
export function textTones(colors: SemanticColors) {
  const readable = (color: string) => ensureContrast(color, colors.background);
  return {
    default: colors.text,
    muted: colors.textMuted,
    primary: readable(colors.primary),
    success: readable(colors.success),
    warning: readable(colors.warning),
    danger: readable(colors.danger),
  };
}

/**
 * Filled tones that all share one text color (white in light mode), with each fill moved just far enough
 * from it to read at WCAG AA. Consistent ink looks calmer than black on some fills and white on others
 */
export function solidTones(colors: SemanticColors) {
  const ink = colors.textOnPrimary;
  const light = hexToOklch(colors.text).l > hexToOklch(colors.background).l ? colors.text : colors.background;
  const solid = (fill: string) => {
    const background = ensureContrast(fill, ink);
    // A hairline in a deeper shade of the fill and a soft top highlight, so small fills read like glossy chips
    return { background, ink, edge: mix(colors.text, background, 0.25), gloss: alpha(light, 0.28) };
  };
  return {
    primary: solid(colors.primary),
    success: solid(colors.success),
    warning: solid(colors.warning),
    danger: solid(colors.danger),
    neutral: solid(mix(colors.text, colors.background, 0.7)),
  };
}

/** Soft tints for tags: a light fill, a border in the tone, and text that reads at AA on that fill */
export function softTones(colors: SemanticColors) {
  const soft = (color: string, text = color) => {
    const background = mix(color, colors.background, 0.1);
    return { background, border: mix(color, colors.background, 0.32), ink: ensureContrast(text, background) };
  };
  return {
    neutral: soft(colors.text, colors.textMuted),
    primary: soft(colors.primary),
    success: soft(colors.success),
    warning: soft(colors.warning),
    danger: soft(colors.danger),
  };
}
