import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateScale, hexToOklch, oklchToHex } from './color.ts';
import { createTheme, defaultTheme, foundations, getTheme, readableTextOn, themes } from './theme.ts';

test('hex survives a round trip through OKLCH', () => {
  for (const hex of ['#5B40DB', '#0E7C66', '#FACC15', '#000000', '#FFFFFF']) {
    assert.equal(oklchToHex(hexToOklch(hex)), hex);
  }
});

test('a generated scale keeps the brand color and gets darker step by step', () => {
  const scale = generateScale('#0e7c66');
  assert.ok(Object.values(scale).includes('#0E7C66'));
  const lightness = Object.values(scale).map((hex) => hexToOklch(hex).l);
  lightness.slice(1).forEach((l, i) => assert.ok(l < lightness[i]!, `step ${i + 1} is not darker`));
});

test('createTheme() without options is the default theme', () => {
  assert.deepEqual(createTheme(), defaultTheme);
});

test('createTheme overrides deep values and keeps the rest', () => {
  const theme = createTheme({
    foundations: { radius: { md: 12 }, typography: { fontFamily: { web: 'Manrope, sans-serif' } } },
    components: { button: { sizes: { md: { height: 48 } } } },
  });
  assert.equal(theme.foundations.radius.md, 12);
  assert.equal(theme.foundations.radius.lg, foundations.radius.lg);
  assert.equal(theme.foundations.typography.fontFamily.web, 'Manrope, sans-serif');
  assert.deepEqual(theme.foundations.typography.fontFamily.native, foundations.typography.fontFamily.native);
  assert.equal(theme.components.button.sizes.md.height, 48);
  assert.equal(theme.components.button.sizes.md.paddingX, 16);
});

test('overriding primary alone picks a readable textOnPrimary', () => {
  const theme = createTheme({ colors: { light: { primary: '#FACC15' } } });
  assert.equal(theme.themes.light.colors.primary, '#FACC15');
  assert.equal(theme.themes.light.colors.textOnPrimary, readableTextOn('#FACC15'));
  assert.equal(theme.themes.dark.colors.primary, themes.dark.colors.primary);
});

test('getTheme resolves foundations, components and scheme tokens together', () => {
  const dark = getTheme('dark');
  assert.equal(dark.scheme, 'dark');
  assert.equal(dark.colors.background, themes.dark.colors.background);
  assert.equal(dark.space.lg, 16);
  assert.equal(dark.components.button.sizes.md.height, 44);
  assert.equal(dark.glass.blur.md, 24);
});
