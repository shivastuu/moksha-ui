import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, RollingAmount, Surface } from 'tandemui';

const meta = {
  title: 'Blocks/Rolling amount',
  component: RollingAmount,
  args: { value: 24580, size: 'xl' },
  argTypes: { size: { control: 'inline-radio', options: ['md', 'lg', 'xl'] } },
} satisfies Meta<typeof RollingAmount>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Balance: Story = {
  render: function BalanceStory(args) {
    const [balance, setBalance] = useState(args.value);
    const [hidden, setHidden] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 20, maxWidth: 380 }}>
        <Surface variant="raised" padding="xl" radius="xl">
          <div style={{ display: 'grid', gap: 6, fontFamily: 'var(--ds-font-sans)' }}>
            <span style={{ fontSize: 13, color: 'var(--ds-color-text-muted)' }}>Available balance</span>
            <RollingAmount {...args} value={balance} hidden={hidden} />
          </div>
        </Surface>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Button size="sm" onPress={() => setBalance(balance + 12500)}>
            Add ₹12,500
          </Button>
          <Button size="sm" variant="secondary" onPress={() => setBalance(Math.max(0, balance - 2499.5))}>
            Pay ₹2,499.50
          </Button>
          <Button size="sm" variant="ghost" onPress={() => setHidden(!hidden)}>
            {hidden ? 'Show balance' : 'Hide balance'}
          </Button>
        </div>
      </div>
    );
  },
};
