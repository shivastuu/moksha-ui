import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Receipt, SlideToConfirm, Slider, Sparkline, StatCard, Tag, Text } from '@moksha-ui/core';

const meta = { title: 'Components/Money' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const rupees = (value: number) => `₹ ${value.toLocaleString('en-IN')}`;

export const SipPlanner: Story = {
  render: function SipPlannerStory() {
    const [monthly, setMonthly] = useState(5000);
    const [years, setYears] = useState(10);
    return (
      <div style={{ display: 'grid', gap: 24, maxWidth: 420 }}>
        <Slider label="Monthly SIP" min={500} max={50000} step={500} value={monthly} onValueChange={setMonthly} format={rupees} />
        <Slider label="Duration" min={1} max={30} value={years} onValueChange={setYears} format={(n) => `${n} yrs`} />
        <Text tone="muted">
          You invest {rupees(monthly * 12 * years)} over {years} years.
        </Text>
      </div>
    );
  },
};

export const SlideToPay: Story = {
  render: function SlideToPayStory() {
    const [run, setRun] = useState(0);
    return (
      <div style={{ display: 'grid', gap: 16, maxWidth: 380 }}>
        <SlideToConfirm key={run} label="Slide to pay ₹ 486" pendingLabel="Paying" doneLabel="Paid ₹ 486" onConfirm={() => new Promise((resolve) => setTimeout(resolve, 1200))} />
        <div>
          <Button variant="secondary" size="sm" onPress={() => setRun(run + 1)}>
            Reset
          </Button>
        </div>
      </div>
    );
  },
};

export const Trends: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', maxWidth: 480 }}>
      {[
        { label: 'Spent this week', value: '₹ 8,420', change: '18%', trend: 'up' as const, upIsGood: false, data: [920, 1100, 860, 1340, 1210, 1480, 1510] },
        { label: 'Savings', value: '₹ 1,24,300', change: '6.2%', trend: 'up' as const, upIsGood: true, data: [110, 112, 111, 115, 118, 117, 124] },
      ].map((stat) => (
        <div key={stat.label} style={{ display: 'grid', gap: 12 }}>
          <StatCard label={stat.label} value={stat.value} change={stat.change} trend={stat.trend} upIsGood={stat.upIsGood} />
          <Sparkline data={stat.data} upIsGood={stat.upIsGood} width={220} height={48} accessibilityLabel={`${stat.label}, rising over 7 days`} />
        </div>
      ))}
    </div>
  ),
};

export const PaymentReceipt: Story = {
  render: () => (
    <div style={{ maxWidth: 380 }}>
      <Receipt
        status="success"
        amount={486}
        title="Paid to Swiggy"
        subtitle="17 Nov 2026, 1:24 pm"
        details={[
          { label: 'Status', value: <Tag tone="success" dot>Successful</Tag> },
          { label: 'UTR', value: '4021 8876 1290' },
          { label: 'From', value: 'Savings •• 4821' },
          { label: 'To', value: 'swiggy@icici' },
        ]}
        actions={
          <>
            <Button variant="secondary" size="sm">
              Share
            </Button>
            <Button variant="secondary" size="sm">
              Download
            </Button>
          </>
        }
      />
    </div>
  ),
};
