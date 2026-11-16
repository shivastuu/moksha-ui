import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarGroup, Badge, Button, Chip, Divider, IconButton, Link, ProgressBar, ProgressRing, Skeleton, Spinner, Stack, Surface, Tag, Text } from '@moksha-ui/core';

const meta = { title: 'Components/Primitives' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Typography: Story = {
  render: () => (
    <Stack gap="sm">
      <Text as="h1" variant="display">₹ 24,580</Text>
      <Text as="h2" variant="heading">Good evening, Shivastu</Text>
      <Text variant="title">Recent payments</Text>
      <Text as="p" variant="body" tone="muted">
        Your card statement is ready. Pay before 5 December to avoid interest.
      </Text>
      <Stack direction="row" gap="lg" wrap>
        <Text variant="label" tone="primary">Primary</Text>
        <Text variant="label" tone="success">Paid</Text>
        <Text variant="label" tone="warning">Due soon</Text>
        <Text variant="label" tone="danger">Overdue</Text>
      </Stack>
    </Stack>
  ),
};

export const LoadingStates: Story = {
  render: function LoadingStory() {
    const [loading, setLoading] = useState(true);
    return (
      <Stack gap="lg" align="start">
        <div style={{ width: 340 }}>
          <Surface variant="raised" padding="lg" radius="xl">
            {loading ? (
              <Stack direction="row" gap="md" align="center">
                <Skeleton shape="circle" height={44} />
                <div style={{ flex: 1 }}>
                  <Skeleton lines={2} height={12} />
                </div>
              </Stack>
            ) : (
              <Stack direction="row" gap="md" align="center">
                <div style={{ width: 44, height: 44, borderRadius: 999, background: 'var(--ds-color-primary-subtle)' }} />
                <Stack gap="xs">
                  <Text variant="label">Swiggy</Text>
                  <Text variant="caption" tone="muted">Today, 8:42 PM · ₹ 486.00</Text>
                </Stack>
              </Stack>
            )}
          </Surface>
        </div>
        <Stack direction="row" gap="lg" align="center">
          <Spinner size="sm" />
          <Spinner />
          <Spinner size="lg" />
          <Button variant="secondary" size="sm" onPress={() => setLoading(!loading)}>
            {loading ? 'Show content' : 'Show skeleton'}
          </Button>
        </Stack>
      </Stack>
    );
  },
};

export const BadgesAndDividers: Story = {
  render: function BadgeStory() {
    const [count, setCount] = useState(3);
    const bell = (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
        <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16ZM10 20.5a2 2 0 0 0 4 0" />
      </svg>
    );
    return (
      <Stack gap="xl" align="start">
        <Stack direction="row" gap="xl" align="center">
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <IconButton icon={bell} accessibilityLabel="Notifications" variant="soft" />
            <span style={{ position: 'absolute', top: -4, right: -6 }}>
              <Badge count={count} label={`${count} unread notifications`} />
            </span>
          </div>
          <Badge count={128} tone="primary" />
          <Badge count={7} tone="success" />
          <Badge count={2} tone="warning" />
          <Badge count={12} tone="neutral" />
          <Badge dot tone="danger" label="New" />
          <Button size="sm" variant="secondary" onPress={() => setCount(count + 1)}>
            New notification
          </Button>
        </Stack>
        <div style={{ width: 340, display: 'grid', gap: 16 }}>
          <Divider />
          <Divider label="or continue with" />
        </div>
      </Stack>
    );
  },
};

const filters = ['All', 'Food', 'Travel', 'Shopping', 'Bills', 'Refunds'];

export const TagsAndChips: Story = {
  render: function TagsAndChipsStory() {
    const [chosen, setChosen] = useState<string[]>(['Food']);
    const toggle = (name: string) => setChosen(chosen.includes(name) ? chosen.filter((item) => item !== name) : [...chosen, name]);
    return (
      <Stack gap="xl" align="start">
        <Stack direction="row" gap="sm" wrap>
          <Tag tone="success" dot>Active</Tag>
          <Tag tone="primary">Premium</Tag>
          <Tag tone="warning" dot>KYC pending</Tag>
          <Tag tone="danger">Blocked</Tag>
          <Tag>Draft</Tag>
          <Tag tone="success" size="sm">Paid</Tag>
        </Stack>
        <Stack direction="row" gap="sm" wrap>
          {filters.map((name) => (
            <Chip key={name} label={name} selected={chosen.includes(name)} onSelectedChange={() => toggle(name)} />
          ))}
        </Stack>
      </Stack>
    );
  },
};

const team = ['Shivastu Shrivastava', 'Asha Rao', 'Ravi Kumar', 'Meera Nair', 'Zoya Ali', 'Arjun Mehta', 'Kabir Singh'];

export const PeopleAndProgress: Story = {
  render: function PeopleStory() {
    const [spent, setSpent] = useState(42);
    return (
      <Stack gap="xl" align="start">
        <Stack direction="row" gap="lg" align="center">
          <Avatar name="Shivastu Shrivastava" size="xl" status="online" />
          <Avatar name="Asha Rao" size="lg" />
          <Avatar name="Ravi Kumar" />
          <Avatar name="Meera Nair" size="sm" status="busy" />
          <AvatarGroup people={team.map((name) => ({ name }))} />
        </Stack>
        <div style={{ width: 360 }}>
          <Surface variant="raised" padding="lg" radius="xl">
            <Stack gap="md">
              <Stack direction="row" justify="between" align="center">
                <Text variant="label">Monthly budget</Text>
                <Text variant="label" tone={spent > 80 ? 'danger' : 'muted'}>
                  ₹{(spent * 500).toLocaleString('en-IN')} of ₹50,000
                </Text>
              </Stack>
              <ProgressBar value={spent} label="Monthly budget used" tone={spent > 80 ? 'danger' : 'primary'} />
              <ProgressBar label="Syncing transactions" size="sm" />
            </Stack>
          </Surface>
        </div>
        <Stack direction="row" gap="xl" align="center">
          <ProgressRing value={spent} label="Budget used">
            <Text variant="label">{spent}%</Text>
          </ProgressRing>
          <ProgressRing value={100} tone="success" label="KYC complete" size={48} thickness={5} />
          <Button size="sm" variant="secondary" onPress={() => setSpent(Math.min(100, spent + 15))}>
            Spend more
          </Button>
          <Link href="https://www.rbi.org.in" external>
            RBI guidelines
          </Link>
        </Stack>
      </Stack>
    );
  },
};
