import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Chip, Drawer, IconButton, Menu, Popover, Stack, Surface, Text, Tooltip } from '@moksha-ui/core';

const meta = { title: 'Components/Floating' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const icon = (d: string) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const icons = {
  more: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="12" r="1.8" />
    </svg>
  ),
  freeze: icon('M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9'),
  limits: icon('M4 18V6m0 12h16M8 14l3-3 3 2 5-5'),
  pin: icon('M7 11V8a5 5 0 0 1 10 0v3M5.5 11h13v9h-13Z'),
  block: icon('M5.6 5.6l12.8 12.8M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z'),
  copy: icon('M9 9h11v11H9ZM15 9V4H4v11h5'),
  info: icon('M12 16v-4m0-4h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z'),
};

export const CardActions: Story = {
  render: function CardActionsStory() {
    const menuAnchor = useRef<HTMLSpanElement>(null);
    const feeAnchor = useRef<HTMLSpanElement>(null);
    const [menu, setMenu] = useState(false);
    const [fees, setFees] = useState(false);
    const [last, setLast] = useState('Nothing yet');
    const act = (label: string) => () => setLast(label);
    return (
      <div style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
        {/* overflow hidden on purpose: the menu still escapes it, from the top layer */}
        <div style={{ overflow: 'hidden', borderRadius: 20 }}>
          <Surface variant="raised" radius="xl" padding="lg">
            <Stack direction="row" align="center" justify="between">
              <Stack gap="xs">
                <Text variant="label">Moksha card •• 4821</Text>
                <Text tone="muted" variant="caption">
                  Last action: {last}
                </Text>
              </Stack>
              <Stack direction="row" gap="xs">
                <Tooltip label="Copy card number">
                  <IconButton icon={icons.copy} accessibilityLabel="Copy card number" variant="ghost" onPress={act('Copied')} />
                </Tooltip>
                <span ref={menuAnchor}>
                  <IconButton icon={icons.more} accessibilityLabel="Card actions" variant="soft" onPress={() => setMenu(!menu)} />
                </span>
              </Stack>
            </Stack>
          </Surface>
        </div>
        <Menu
          anchor={menuAnchor}
          open={menu}
          onClose={() => setMenu(false)}
          accessibilityLabel="Card actions"
          items={[
            { label: 'Freeze card', icon: icons.freeze, onSelect: act('Frozen') },
            { label: 'Set limits', icon: icons.limits, onSelect: act('Limits') },
            { label: 'View PIN', icon: icons.pin, onSelect: act('PIN'), disabled: true },
            { label: 'Block card', icon: icons.block, tone: 'danger', onSelect: act('Blocked') },
          ]}
        />
        <span ref={feeAnchor} style={{ justifySelf: 'start' }}>
          <Button variant="secondary" size="sm" onPress={() => setFees(!fees)}>
            Fee details
          </Button>
        </span>
        <Popover anchor={feeAnchor} open={fees} onClose={() => setFees(false)} accessibilityLabel="Fee details">
          <Stack gap="sm">
            <Text variant="label">No fee on UPI payments</Text>
            <Text tone="muted" variant="caption">
              Card payments abroad have a 2% markup. ATM withdrawals are free up to 5 a month.
            </Text>
            <div>
              <Button size="sm" onPress={() => setFees(false)}>
                Got it
              </Button>
            </div>
          </Stack>
        </Popover>
      </div>
    );
  },
};

export const FiltersDrawer: Story = {
  render: function FiltersDrawerStory() {
    const [open, setOpen] = useState(false);
    const [picked, setPicked] = useState(['Food']);
    const toggle = (name: string) => setPicked(picked.includes(name) ? picked.filter((item) => item !== name) : [...picked, name]);
    return (
      <div style={{ maxWidth: 420 }}>
        <Button onPress={() => setOpen(true)}>Filters</Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Filters"
          actions={
            <>
              <Button variant="secondary" onPress={() => setPicked([])}>
                Clear
              </Button>
              <Button onPress={() => setOpen(false)}>Show results</Button>
            </>
          }
        >
          <Stack gap="md">
            <Text variant="label">Categories</Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Food', 'Travel', 'Shopping', 'Bills', 'Transfers', 'Rent'].map((name) => (
                <Chip key={name} label={name} selected={picked.includes(name)} onSelectedChange={() => toggle(name)} />
              ))}
            </div>
          </Stack>
        </Drawer>
      </div>
    );
  },
};
