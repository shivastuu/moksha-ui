import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BankCard, Button, type BankCardFinish } from 'tandemui';

const meta = {
  title: 'Blocks/Bank card',
  component: BankCard,
  args: { last4: '4821', holder: 'Shivastu Shrivastava', expiry: '08/29', label: 'Tandem', finish: 'brand' },
  argTypes: { finish: { control: 'inline-radio', options: ['brand', 'midnight', 'metal'] } },
} satisfies Meta<typeof BankCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Playground(args) {
    const [flipped, setFlipped] = useState(false);
    const [frozen, setFrozen] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 24, justifyItems: 'center', paddingTop: 24 }}>
        <BankCard {...args} flipped={flipped} frozen={frozen} cvv="•••" />
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onPress={() => setFlipped(!flipped)}>
            {flipped ? 'Show front' : 'Show back'}
          </Button>
          <Button variant="secondary" onPress={() => setFrozen(!frozen)}>
            {frozen ? 'Unfreeze' : 'Freeze card'}
          </Button>
        </div>
      </div>
    );
  },
};

const finishes: BankCardFinish[] = ['brand', 'midnight', 'metal'];

export const Finishes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
      {finishes.map((finish) => (
        <div key={finish} style={{ width: 320 }}>
          <BankCard {...args} finish={finish} label={finish === 'metal' ? 'Tandem Metal' : 'Tandem'} />
        </div>
      ))}
    </div>
  ),
};
