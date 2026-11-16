import assert from 'node:assert/strict';
import { test } from 'node:test';
import { contrastRatio } from './color.ts';
import { createTheme, themes, type ColorScheme, type SchemeTokens, type SemanticColors } from './theme.ts';

const textPairs: [keyof SemanticColors, keyof SemanticColors][] = [
  ['text', 'background'],
  ['text', 'surface'],
  ['text', 'surfaceRaised'],
  ['textMuted', 'background'],
  ['textMuted', 'surface'],
  ['textOnPrimary', 'primary'],
  ['textOnPrimary', 'primaryPressed'],
  ['textInverse', 'surfaceInverse'],
  ['primary', 'background'],
  ['primary', 'primarySubtle'],
  ['danger', 'background'],
];

function checkScheme(label: string, tokens: SchemeTokens) {
  const { colors } = tokens;

  for (const [fg, bg] of textPairs) {
    test(`${label}: ${fg} on ${bg} meets WCAG AA (4.5:1)`, () => {
      const ratio = contrastRatio(colors[fg], colors[bg]);
      assert.ok(ratio >= 4.5, `${colors[fg]} on ${colors[bg]} is ${ratio.toFixed(2)}:1`);
    });
  }

  test(`${label}: focus ring is visible on background (3:1)`, () => {
    const ratio = contrastRatio(colors.focusRing, colors.background);
    assert.ok(ratio >= 3, `${ratio.toFixed(2)}:1`);
  });

  test(`${label}: defines every semantic color and shadow`, () => {
    assert.deepEqual(Object.keys(colors).sort(), Object.keys(themes.light.colors).sort());
    assert.deepEqual(Object.keys(tokens.shadows).sort(), ['lg', 'md', 'sm']);
  });
}

for (const scheme of ['light', 'dark'] as ColorScheme[]) {
  checkScheme(`default ${scheme}`, themes[scheme]);
}

const brandColors = [
  '#E11D48', // rose
  '#F97316', // orange
  '#FACC15', // yellow
  '#84CC16', // lime
  '#0E7C66', // teal
  '#06B6D4', // cyan
  '#2563EB', // blue
  '#7C3AED', // violet
  '#DB2777', // pink
  '#64748B', // gray
  '#111111', // near black
  '#F5F5F5', // near white
];

for (const brandColor of brandColors) {
  const theme = createTheme({ brandColor });
  for (const scheme of ['light', 'dark'] as ColorScheme[]) {
    checkScheme(`brand ${brandColor} ${scheme}`, theme.themes[scheme]);
  }
}
