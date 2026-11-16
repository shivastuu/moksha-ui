import { ensureContrast, hexToOklch, mix, oklchToHex, palette, type SemanticColors } from '@moksha-ui/tokens';

/**
 * Colors for switches, checkboxes and radios. WCAG 1.4.11 asks for 3:1 on the parts that show a
 * control and its state, which many polished UIs skip (a pale off-track). Each color here is moved
 * just far enough to pass
 */
export function controlColors(colors: SemanticColors) {
  const thumb = palette.slate[0];
  // A vivid mid-tone of the brand hue, the same in both schemes like iOS. Dark mode's pale primary,
  // only darkened for contrast, reads washed out. Gray brands keep their neutral hue
  const brand = hexToOklch(colors.primary);
  const vivid = oklchToHex({ l: 0.56, c: brand.c < 0.03 ? brand.c : Math.max(brand.c, 0.16), h: brand.h });
  return {
    thumb,
    switchOn: ensureContrast(vivid, thumb, 3),
    /** A light brand wash for selected cards and chips: calm in dark mode, unlike the deep subtle tint */
    selectedFill: mix(colors.primary, colors.background, 0.12),
    switchOff: ensureContrast(mix(colors.text, colors.background, 0.2), colors.background, 3),
    boxBorder: ensureContrast(colors.border, colors.background, 3),
    segmentTrack: mix(colors.text, colors.background, 0.07),
  };
}
