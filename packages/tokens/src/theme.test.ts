import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateScale, hexToOklch, mix, oklchToHex } from './color.ts';
import { createTheme, defaultTheme, foundations, getTheme, palette, readableTextOn, themes } from './theme.ts';

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

test('every theme color and shadow is built from the palette, with no raw colors', () => {
  const paletteHexes = new Set<string>(Object.values(palette).flatMap((scale) => Object.values(scale)));
  const rgbaToHex = (r: string, g: string, b: string) =>
    `#${[r, g, b].map((v) => Number(v).toString(16).padStart(2, '0')).join('').toUpperCase()}`;

  for (const scheme of ['light', 'dark'] as const) {
    const values = [...Object.values(themes[scheme].colors), ...Object.values(themes[scheme].shadows)];
    for (const value of values) {
      const used = [
        ...(value.match(/#[0-9A-F]{6}/gi) ?? []).map((hex: string) => hex.toUpperCase()),
        ...[...value.matchAll(/rgba\((\d+), (\d+), (\d+), [\d.]+\)/g)].map(([, r, g, b]) => rgbaToHex(r!, g!, b!)),
      ];
      assert.ok(used.length > 0, `${scheme}: "${value}" has no recognisable color`);
      for (const color of used) {
        assert.ok(paletteHexes.has(color), `${scheme}: ${color} in "${value}" is not a palette token`);
      }
    }
  }
});

test('createTheme uses the exact brand color when it is accessible, and a nearby shade when not', () => {
  const ink = createTheme({ brandColor: '#18181B' });
  assert.equal(ink.themes.light.colors.primary, '#18181B');
  assert.notEqual(ink.themes.light.colors.primaryPressed, '#18181B');

  const cobalt = createTheme({ brandColor: '#3355FF' });
  assert.equal(cobalt.themes.light.colors.primary, '#3355FF');

  const tangerine = createTheme({ brandColor: '#FF6B2C' });
  assert.notEqual(tangerine.themes.light.colors.primary, '#FF6B2C');
});

test('createTheme handles brand colors at both ends of the scale', () => {
  for (const brandColor of ['#FFFFFF', '#FAFAFA', '#000000', '#0A0A0A']) {
    const theme = createTheme({ brandColor });
    for (const scheme of ['light', 'dark'] as const) {
      const { primary, primaryPressed } = theme.themes[scheme].colors;
      assert.match(primary, /^#[0-9A-F]{6}$/);
      assert.match(primaryPressed, /^#[0-9A-F]{6}$/);
    }
  }
});

test('mix() matches CSS color-mix in OKLab', () => {
  assert.equal(mix('#000000', '#FFFFFF', 0.5), '#636363');
  assert.equal(mix('#3355FF', '#FFFFFF', 0), '#FFFFFF');
  assert.equal(mix('#3355FF', '#FFFFFF', 1), '#3355FF');
});
