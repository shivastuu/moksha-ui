import type { Meta, StoryObj } from '@storybook/react-vite';
import { tokens, useTheme } from '@shivastu/ui';

function Swatches() {
  const { colors, scheme } = useTheme();
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Colors ({scheme})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {Object.entries(colors).map(([name, value]) => (
          <div
            key={name}
            style={{ border: '1px solid var(--ds-color-border)', borderRadius: tokens.radius.md, overflow: 'hidden' }}
          >
            <div style={{ height: 56, background: value }} />
            <div style={{ padding: '8px 10px', fontSize: 13 }}>
              <div style={{ fontWeight: 600 }}>{name}</div>
              <code style={{ color: 'var(--ds-color-text-muted)' }}>{value}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypeScale() {
  return (
    <div>
      <h2>Type scale (Inter)</h2>
      {Object.entries(tokens.fontSize).map(([name, size]) => (
        <div key={name} style={{ display: 'flex', gap: 16, alignItems: 'baseline', marginBottom: 8 }}>
          <code style={{ width: 48, color: 'var(--ds-color-text-muted)' }}>{name}</code>
          <span style={{ fontSize: size, lineHeight: `${tokens.lineHeight[name as keyof typeof tokens.lineHeight]}px` }}>
            Pay your card bill in one tap ({size}px)
          </span>
        </div>
      ))}
    </div>
  );
}

const meta = { title: 'Foundations/Tokens' } satisfies Meta;

export default meta;

export const Colors: StoryObj = { render: () => <Swatches /> };

export const Typography: StoryObj = { render: () => <TypeScale /> };
