import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Divider, RadioGroup, SegmentedControl, Stack, Surface, Switch, Text } from '@moksha-ui/core';

const meta = { title: 'Components/Selection' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const CardSettings: Story = {
  render: function CardSettingsStory() {
    const [period, setPeriod] = useState('month');
    const [payees, setPayees] = useState([true, false, true]);
    const all = payees.every(Boolean) ? true : payees.some(Boolean) ? 'mixed' : false;
    return (
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 360px))', alignItems: 'start' }}>
        <Surface variant="raised" padding="lg" radius="xl">
          <Stack gap="lg">
            <Text variant="title">Card controls</Text>
            <Switch label="Online payments" defaultChecked />
            <Divider />
            <Switch label="International payments" description="Use your card outside India" />
            <Divider />
            <Switch label="Contactless" defaultChecked description="Tap to pay up to ₹ 5,000" />
            <Divider />
            <Switch label="ATM withdrawals" disabled />
          </Stack>
        </Surface>
        <Surface variant="raised" padding="lg" radius="xl">
          <Stack gap="lg">
            <SegmentedControl
              accessibilityLabel="Statement period"
              value={period}
              onValueChange={setPeriod}
              options={[
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'year', label: 'Year' },
              ]}
            />
            <Checkbox label="Select all payees" checked={all} onCheckedChange={(next) => setPayees(payees.map(() => next))} />
            {['Shivastu Shrivastava', 'Electricity board', 'Asha Rao'].map((name, index) => (
              <Checkbox
                key={name}
                label={name}
                checked={payees[index]}
                onCheckedChange={(next) => setPayees(payees.map((value, position) => (position === index ? next : value)))}
              />
            ))}
          </Stack>
        </Surface>
        <Surface variant="raised" padding="lg" radius="xl">
          <RadioGroup
            label="Pay from"
            defaultValue="savings"
            options={[
              { value: 'savings', label: 'Savings •• 4821', description: 'Balance ₹ 24,580.00' },
              { value: 'salary', label: 'Salary •• 1034', description: 'Balance ₹ 1,02,400.00' },
              { value: 'joint', label: 'Joint •• 7790', description: 'Frozen', disabled: true },
            ]}
          />
        </Surface>
      </div>
    );
  },
};
