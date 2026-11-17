import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, BankCard, CardStack, Select, Sidebar, Stack, Text } from '@moksha-ui/core';

const meta = { title: 'Components/App shell' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const glyph = (d: string) => (color: string) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

export const AccountSetup: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20, maxWidth: 400 }}>
      <Select
        label="Bank"
        placeholder="Choose a bank"
        helperText="Where your salary comes in"
        options={[
          { value: 'hdfc', label: 'HDFC Bank' },
          { value: 'icici', label: 'ICICI Bank' },
          { value: 'sbi', label: 'State Bank of India' },
          { value: 'yes', label: 'Yes Bank', disabled: true },
        ]}
      />
      <Select label="Account type" defaultValue="savings" options={[{ value: 'savings', label: 'Savings' }, { value: 'current', label: 'Current' }, { value: 'salary', label: 'Salary' }]} />
      <Select label="State" placeholder="Choose a state" error="Choose the state on your address proof" options={[{ value: 'ka', label: 'Karnataka' }, { value: 'mh', label: 'Maharashtra' }]} />
    </div>
  ),
};

export const AppSidebar: Story = {
  render: function AppSidebarStory() {
    const [page, setPage] = useState('home');
    return (
      <div style={{ display: 'flex', height: 560, maxWidth: 720, overflow: 'hidden', borderRadius: 20, boxShadow: '0 0 0 1px var(--ds-surface-edge)' }}>
        <Sidebar
          value={page}
          onValueChange={setPage}
          header={
            <div style={{ padding: '0 12px' }}>
              <Text variant="title">Moksha</Text>
            </div>
          }
          footer={
            <Stack direction="row" gap="sm" align="center">
              <Avatar name="Shivastu Shrivastava" size="sm" />
              <Text variant="label">Shivastu</Text>
            </Stack>
          }
          sections={[
            {
              items: [
                { value: 'home', label: 'Home', icon: glyph('M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1Z') },
                { value: 'activity', label: 'Activity', icon: glyph('M4 12h4l2-6 4 12 2-6h4') },
              ],
            },
            {
              title: 'Money',
              items: [
                { value: 'accounts', label: 'Accounts', icon: glyph('M3.5 9.5 12 4l8.5 5.5M5 10v8m4.5-8v8m5-8v8m4.5-8v8M3.5 20h17') },
                { value: 'cards', label: 'Cards', icon: glyph('M3.5 7.5A2 2 0 0 1 5.5 5.5h13a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2ZM3.5 10h17') },
                { value: 'requests', label: 'Requests', count: 3, icon: glyph('M12 4v16m0-16-4 4m4-4 4 4') },
              ],
            },
            {
              title: 'Settings',
              items: [{ value: 'security', label: 'Security', icon: glyph('M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6Z') }],
            },
          ]}
        />
        <div style={{ flex: 1, padding: 32 }}>
          <Text variant="heading">{page[0]!.toUpperCase() + page.slice(1)}</Text>
        </div>
      </div>
    );
  },
};

export const Wallet: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <CardStack
        cards={[
          { key: 'brand', label: 'Moksha •• 4821', card: <BankCard last4="4821" holder="Shivastu Shrivastava" expiry="08/29" finish="brand" interactive={false} /> },
          { key: 'metal', label: 'Moksha Metal •• 2290', card: <BankCard last4="2290" holder="Shivastu Shrivastava" expiry="11/30" finish="metal" label="Moksha Metal" interactive={false} /> },
          { key: 'midnight', label: 'Travel •• 7712', card: <BankCard last4="7712" holder="Shivastu Shrivastava" expiry="03/28" finish="midnight" label="Travel" interactive={false} /> },
        ]}
      />
    </div>
  ),
};
