import { describe, expect, it } from 'vitest';
import { components, contrastRatio, createTheme, defaultTheme, type ColorScheme } from '@moksha-ui/tokens';
import { bannerColors, bannerTones } from './Banner.shared';
import { promoColors } from '../PromoBanner/PromoBanner.shared';

const themes = [
  ['default', defaultTheme],
  ...['#E11D48', '#F97316', '#FACC15', '#0E7C66', '#06B6D4', '#7C3AED', '#111111', '#F5F5F5'].map(
    (brand) => [brand, createTheme({ brandColor: brand })] as const
  ),
] as const;

describe('banner colors', () => {
  for (const [name, theme] of themes) {
    for (const scheme of ['light', 'dark'] as ColorScheme[]) {
      it(`${name} ${scheme}: text is AA on every tone, and every icon is visible`, () => {
        const { colors } = theme.themes[scheme];
        for (const tone of bannerTones) {
          const { accent, background, glyph } = bannerColors(tone, colors, components.banner.tint);
          expect(contrastRatio(colors.text, background), `${tone} text`).toBeGreaterThanOrEqual(4.5);
          expect(contrastRatio(colors.textMuted, background), `${tone} muted text`).toBeGreaterThanOrEqual(4.5);
          expect(contrastRatio(glyph, accent), `${tone} glyph`).toBeGreaterThanOrEqual(3);
        }
      });
    }
  }

  it('promo gradient goes from the pressed to the normal brand color', () => {
    const { colors } = defaultTheme.themes.light;
    expect(promoColors(colors).background).toContain(`linear-gradient(135deg, ${colors.primaryPressed}, ${colors.primary})`);
  });
});
