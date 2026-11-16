import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Surface, palette } from '@moksha-ui/core';

function Backdrop({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        padding: 32,
        borderRadius: 24,
        overflow: 'hidden',
        background: [
          `radial-gradient(circle at 15% 25%, ${palette.red[300]} 0, transparent 35%)`,
          `radial-gradient(circle at 80% 20%, ${palette.brand[500]} 0, transparent 40%)`,
          `radial-gradient(circle at 55% 85%, ${palette.green[300]} 0, transparent 40%)`,
          'var(--ds-color-background)',
        ].join(', '),
      }}
    >
      {children}
    </div>
  );
}

function CardContent({ title }: { title: string }) {
  return (
    <div style={{ display: 'grid', gap: 12, fontFamily: 'var(--ds-font-sans)' }}>
      <div style={{ fontSize: 13, color: 'var(--ds-color-text-muted)' }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 600 }}>₹ 24,580.00</div>
      <Button size="sm">Pay bill</Button>
    </div>
  );
}

const meta = {
  title: 'Components/Surface',
  component: Surface,
  args: { variant: 'glass', blur: 'md', padding: 'xl', radius: 'xl' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'raised', 'glass'] },
    blur: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    padding: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] },
    radius: { control: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'] },
    shadow: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Surface>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Backdrop>
      <div style={{ maxWidth: 320 }}>
        <Surface {...args}>
          <CardContent title="Card balance" />
        </Surface>
      </div>
    </Backdrop>
  ),
};

export const Variants: Story = {
  render: () => (
    <Backdrop>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        <Surface variant="solid" padding="xl" radius="xl">
          <CardContent title="Solid" />
        </Surface>
        <Surface variant="raised" padding="xl" radius="xl">
          <CardContent title="Raised" />
        </Surface>
        <Surface variant="glass" padding="xl" radius="xl">
          <CardContent title="Glass" />
        </Surface>
      </div>
    </Backdrop>
  ),
};

export const GlassBlurLevels: Story = {
  name: 'Glass blur levels',
  render: () => (
    <Backdrop>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {(['sm', 'md', 'lg'] as const).map((blur) => (
          <Surface key={blur} variant="glass" blur={blur} padding="xl" radius="xl">
            <CardContent title={`blur="${blur}"`} />
          </Surface>
        ))}
      </div>
    </Backdrop>
  ),
};
