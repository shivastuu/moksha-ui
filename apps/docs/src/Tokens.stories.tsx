import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTheme, type TextStyleName } from 'tandemui';

function Heading({ children }: { children: ReactNode }) {
  return <h2 style={{ margin: '0 0 16px', fontSize: 20 }}>{children}</h2>;
}

function Code({ children, width }: { children: ReactNode; width?: number }) {
  return (
    <code style={{ color: 'var(--ds-color-text-muted)', fontSize: 12, width, flexShrink: 0 }}>{children}</code>
  );
}

function Colors() {
  const { colors, scheme } = useTheme();
  return (
    <section>
      <Heading>Colors ({scheme})</Heading>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
        {Object.entries(colors).map(([name, value]) => (
          <div
            key={name}
            style={{ border: '1px solid var(--ds-color-border)', borderRadius: 'var(--ds-radius-md)', overflow: 'hidden' }}
          >
            <div style={{ height: 48, background: value }} />
            <div style={{ padding: '8px 10px' }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{name}</div>
              <Code>{value}</Code>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Typography() {
  const { typography } = useTheme();
  return (
    <section>
      <Heading>Text styles</Heading>
      {(Object.keys(typography.textStyles) as TextStyleName[]).map((name) => {
        const style = typography.textStyles[name];
        return (
          <div key={name} style={{ display: 'flex', gap: 16, alignItems: 'baseline', marginBottom: 10 }}>
            <Code width={80}>{name}</Code>
            <span
              style={{
                fontSize: style.fontSize,
                lineHeight: `${style.lineHeight}px`,
                fontWeight: typography.fontWeight[style.fontWeight],
              }}
            >
              Pay your card bill in one tap
            </span>
            <Code>
              {style.fontSize}/{style.lineHeight} {style.fontWeight}
            </Code>
          </div>
        );
      })}
    </section>
  );
}

function Scales() {
  const { space, radius, shadows } = useTheme();
  return (
    <section style={{ display: 'grid', gap: 32 }}>
      <div>
        <Heading>Spacing</Heading>
        {Object.entries(space).map(([name, value]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <Code width={80}>{`${name} ${value}px`}</Code>
            <div style={{ width: value * 4, height: 12, background: 'var(--ds-color-primary)', borderRadius: 3 }} />
          </div>
        ))}
      </div>
      <div>
        <Heading>Radius</Heading>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {Object.entries(radius).map(([name, value]) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: value,
                  background: 'var(--ds-color-primary-subtle)',
                  border: '1px solid var(--ds-color-primary)',
                }}
              />
              <Code>{name}</Code>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Heading>Shadows</Heading>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {Object.entries(shadows).map(([name, value]) => (
            <div
              key={name}
              style={{
                width: 160,
                padding: 16,
                borderRadius: 'var(--ds-radius-lg)',
                background: 'var(--ds-color-surface-raised)',
                boxShadow: value,
              }}
            >
              <div style={{ fontWeight: 600 }}>{name}</div>
              <Code>{value}</Code>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const meta = { title: 'Foundations/Theme' } satisfies Meta;

export default meta;

export const ColorTokens: StoryObj = { name: 'Colors', render: () => <Colors /> };

export const TextStyles: StoryObj = { name: 'Typography', render: () => <Typography /> };

export const SpacingRadiusShadows: StoryObj = { name: 'Spacing, radius and shadows', render: () => <Scales /> };
