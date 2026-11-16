import assert from 'node:assert/strict';
import { test } from 'node:test';
import { themes, type ColorScheme, type SemanticColors } from './theme.ts';

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

const textPairs: [keyof SemanticColors, keyof SemanticColors][] = [
  ['text', 'background'],
  ['text', 'surface'],
  ['textMuted', 'background'],
  ['textMuted', 'surface'],
  ['textOnPrimary', 'primary'],
  ['textOnPrimary', 'primaryPressed'],
  ['primary', 'background'],
  ['primary', 'primarySubtle'],
  ['danger', 'background'],
  ['text', 'surfaceRaised'],
  ['textInverse', 'surfaceInverse'],
];

for (const scheme of ['light', 'dark'] as ColorScheme[]) {
  const { colors } = themes[scheme];

  for (const [fg, bg] of textPairs) {
    test(`${scheme}: ${fg} on ${bg} meets WCAG AA (4.5:1)`, () => {
      const ratio = contrast(colors[fg], colors[bg]);
      assert.ok(ratio >= 4.5, `${ratio.toFixed(2)}:1`);
    });
  }

  test(`${scheme}: focus ring is visible on background (3:1)`, () => {
    const ratio = contrast(colors.focusRing, colors.background);
    assert.ok(ratio >= 3, `${ratio.toFixed(2)}:1`);
  });

  test(`${scheme}: defines a value for every semantic color and shadow`, () => {
    assert.deepEqual(Object.keys(colors).sort(), Object.keys(themes.light.colors).sort());
    assert.deepEqual(Object.keys(themes[scheme].shadows).sort(), ['lg', 'md', 'sm']);
  });
}
