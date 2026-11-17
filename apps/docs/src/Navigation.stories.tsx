import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppBar, BankCard, Breadcrumbs, IconButton, Pagination, TabBar, Text } from '@moksha-ui/core';

const meta = { title: 'Components/Navigation' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const glyph = (d: string) => (color: string) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

const icons = {
  home: glyph('M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1Z'),
  cards: glyph('M3.5 7.5A2 2 0 0 1 5.5 5.5h13a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2ZM3.5 10h17M7 15h3'),
  pay: glyph('M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M8 12h8'),
  profile: glyph('M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0'),
  download: glyph('M12 4v11m0 0-4-4m4 4 4-4M5 20h14'),
};

export const ScreenHeader: Story = {
  render: function ScreenHeaderStory() {
    const [page, setPage] = useState(4);
    return (
      <div style={{ display: 'grid', gap: 24, maxWidth: 440 }}>
        <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 0 0 1px var(--ds-surface-edge)' }}>
          <AppBar
            title="Statements"
            subtitle="Savings •• 4821"
            onBack={() => {}}
            actions={<IconButton icon={icons.download('currentColor')} accessibilityLabel="Download all" variant="ghost" />}
          />
        </div>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '#' },
            { label: 'Accounts', href: '#' },
            { label: 'Savings •• 4821', href: '#' },
            { label: 'Statements', href: '#' },
            { label: 'October 2026' },
          ]}
        />
        <Pagination page={page} onPageChange={setPage} pageCount={12} accessibilityLabel="Statement pages" />
        <Text tone="muted" variant="caption">
          Page {page} of 12
        </Text>
      </div>
    );
  },
};

export const FloatingTabBar: Story = {
  render: () => (
    <div style={{ position: 'relative', display: 'grid', gap: 16, maxWidth: 400, paddingBottom: 12 }}>
      <BankCard last4="4821" holder="Shivastu Shrivastava" expiry="08/29" finish="brand" interactive={false} />
      <div style={{ position: 'sticky', bottom: 16, marginTop: -64 }}>
        <TabBar
          items={[
            { value: 'home', label: 'Home', icon: icons.home },
            { value: 'cards', label: 'Cards', icon: icons.cards },
            { value: 'pay', label: 'Scan & pay', icon: icons.pay, badge: 2 },
            { value: 'profile', label: 'Profile', icon: icons.profile },
          ]}
        />
      </div>
    </div>
  ),
};
