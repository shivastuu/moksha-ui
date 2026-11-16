import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  Surface,
  ThemeProvider,
  contrastRatio,
  createTheme,
  generateScale,
  palette,
  readableTextOn,
  type ColorScheme,
  type ThemeDefinition,
} from 'tandemui';

const exampleBrandColors = [palette.brand[600], '#0E9F7A', '#18181B', '#FF6B2C', '#E11D48', '#FACC15'];

function Preview({ theme, scheme }: { theme: ThemeDefinition; scheme: ColorScheme }) {
  const { colors } = theme.themes[scheme];
  return (
    <ThemeProvider theme={theme} colorScheme={scheme}>
      <div
        style={{
          background: 'var(--ds-color-background)',
          color: 'var(--ds-color-text)',
          padding: 20,
          borderRadius: 16,
          border: '1px solid var(--ds-color-border)',
          display: 'grid',
          gap: 16,
        }}
      >
        <strong style={{ textTransform: 'capitalize' }}>{scheme}</strong>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <Surface variant="raised" padding="lg">
          <div style={{ fontSize: 13, color: 'var(--ds-color-text-muted)' }}>Card balance</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>₹ 24,580.00</div>
        </Surface>
        <code style={{ fontSize: 12, color: 'var(--ds-color-text-muted)' }}>
          primary {colors.primary} · text on primary {contrastRatio(colors.textOnPrimary, colors.primary).toFixed(1)}:1 ·
          on background {contrastRatio(colors.primary, colors.background).toFixed(1)}:1
        </code>
      </div>
    </ThemeProvider>
  );
}

function ThemeBuilder() {
  const [brandColor, setBrandColor] = useState('#0E7C66');
  const valid = /^#[0-9a-f]{6}$/i.test(brandColor);
  const theme = useMemo(() => (valid ? createTheme({ brandColor }) : createTheme()), [brandColor, valid]);
  const scale = useMemo(() => (valid ? generateScale(brandColor) : null), [brandColor, valid]);

  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 980 }}>
      <div>
        <h2 style={{ margin: '0 0 6px' }}>Theme builder</h2>
        <p style={{ margin: 0, color: 'var(--ds-color-text-muted)' }}>
          Pick a brand color. <code>createTheme({`{ brandColor }`})</code> generates the scale and every light and dark
          token, kept at WCAG AA contrast.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="color"
          aria-label="Brand color"
          value={valid ? brandColor : palette.slate[950]}
          onChange={(event) => setBrandColor(event.target.value.toUpperCase())}
          style={{ width: 44, height: 36, border: 'none', background: 'none', padding: 0 }}
        />
        <input
          aria-label="Brand color hex"
          value={brandColor}
          onChange={(event) => setBrandColor(event.target.value)}
          style={{ width: 110, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--ds-color-border)', font: 'inherit' }}
        />
        {exampleBrandColors.map((preset) => (
          <button
            key={preset}
            type="button"
            aria-label={`Use ${preset}`}
            onClick={() => setBrandColor(preset)}
            style={{ width: 28, height: 28, borderRadius: 999, border: '2px solid var(--ds-color-border)', background: preset, cursor: 'pointer' }}
          />
        ))}
      </div>

      {scale && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', borderRadius: 12, overflow: 'hidden' }}>
          {Object.entries(scale).map(([step, hex]) => (
            <div key={step} style={{ background: hex, padding: '28px 6px 8px', fontSize: 11, color: readableTextOn(hex) }}>
              <div style={{ fontWeight: 600 }}>{step}</div>
              <div>{hex}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        <Preview theme={theme} scheme="light" />
        <Preview theme={theme} scheme="dark" />
      </div>
    </div>
  );
}

const meta = { title: 'Foundations/Theme builder' } satisfies Meta;

export default meta;

export const Builder: StoryObj = { name: 'Theme builder', render: () => <ThemeBuilder /> };
