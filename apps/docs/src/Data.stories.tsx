import type { Meta, StoryObj } from '@storybook/react-vite';
import { DetailRow, EmptyState, ListGroup, StatCard, Tag, TransactionRow } from '@moksha-ui/core';

const meta = { title: 'Components/Data display' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const open = () => {};

export const Transactions: Story = {
  render: () => (
    <div style={{ maxWidth: 440 }}>
      <ListGroup title="Today">
        <TransactionRow name="Swiggy" amount={486} direction="debit" method="UPI" time="1:24 pm" onPress={open} />
        <TransactionRow name="Ravi Kumar" amount={1200} direction="debit" method="UPI" time="11:05 am" status="pending" onPress={open} />
        <TransactionRow name="Electricity board" amount={1840} direction="debit" method="Card •• 4821" time="9:30 am" status="failed" onPress={open} />
      </ListGroup>
      <div style={{ height: 24 }} />
      <ListGroup title="1 November">
        <TransactionRow name="Moksha Labs" amount={102400} direction="credit" method="Salary" time="10:00 am" onPress={open} />
        <TransactionRow name="Amazon" amount={2399} direction="debit" method="Card •• 4821" time="8:12 pm" onPress={open} />
      </ListGroup>
    </div>
  ),
};

export const Receipt: Story = {
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <ListGroup title="Payment details" footer="Keep the UTR number for any query with your bank.">
        <DetailRow label="Paid to" value="Swiggy" />
        <DetailRow label="Amount" value="₹ 486.00" />
        <DetailRow label="Status" value={<Tag tone="success" dot>Successful</Tag>} />
        <DetailRow label="UTR" value="4021 8876 1290" />
        <DetailRow label="From" value="Savings •• 4821" />
        <DetailRow label="Date" value="17 Nov 2026, 1:24 pm" />
      </ListGroup>
    </div>
  ),
};

export const Stats: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', maxWidth: 720 }}>
      <StatCard label="Spent this month" value="₹ 42,180" change="12.4%" trend="up" upIsGood={false} caption="vs October" />
      <StatCard label="Saved this month" value="₹ 18,500" change="8%" trend="up" caption="vs October" />
      <StatCard label="Rewards" value="1,240 pts" change="0%" trend="flat" caption="this week" />
    </div>
  ),
};

const Inbox = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 13h4l1.5 2.5h5L16 13h4" />
    <path d="M5.5 6.5 4 13v5a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 18v-5l-1.5-6.5A1.5 1.5 0 0 0 17 5.5H7a1.5 1.5 0 0 0-1.5 1Z" />
  </svg>
);

export const Empty: Story = {
  render: () => (
    <div style={{ maxWidth: 440 }}>
      <EmptyState
        icon={<Inbox />}
        title="No transactions yet"
        description="Add money to your account and your payments will show up here."
        action={{ label: 'Add money', onPress: open }}
      />
    </div>
  ),
};
