import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, Avatar, ListGroup, ListItem, Switch, Tabs } from '@moksha-ui/core';

const meta = { title: 'Components/Lists' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const open = () => {};

export const Settings: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 28, maxWidth: 400 }}>
      <ListGroup>
        <ListItem
          title="Shivastu Shrivastava"
          description="Savings •• 4821 · KYC verified"
          leading={<Avatar name="Shivastu Shrivastava" size="lg" />}
          onPress={open}
        />
      </ListGroup>
      <ListGroup title="Preferences">
        <ListItem title="Language" trailing="English" onPress={open} />
        <ListItem title="Default account" trailing="Savings •• 4821" onPress={open} />
        <ListItem title="Statements" description="Monthly, by email" onPress={open} />
      </ListGroup>
      <ListGroup title="Security" footer="App lock asks for your device PIN or Face ID each time you open the app.">
        <ListItem title="App lock" trailing={<Switch accessibilityLabel="App lock" defaultChecked />} />
        <ListItem title="Change MPIN" onPress={open} />
        <ListItem title="Trusted devices" trailing="2" onPress={open} />
      </ListGroup>
    </div>
  ),
};

const payments = [
  { name: 'Swiggy', detail: 'UPI · Today, 1:24 pm', amount: '− ₹ 486.00', via: 'upi' },
  { name: 'Moksha Labs', detail: 'Salary · 1 Nov', amount: '+ ₹ 1,02,400.00', via: 'bank' },
  { name: 'Amazon', detail: 'Card •• 4821 · 30 Oct', amount: '− ₹ 2,399.00', via: 'card' },
  { name: 'Ravi Kumar', detail: 'UPI · 29 Oct', amount: '− ₹ 1,200.00', via: 'upi' },
];

const feed = (via?: string) => (
  <ListGroup>
    {payments
      .filter((payment) => !via || payment.via === via)
      .map((payment) => (
        <ListItem key={payment.name} title={payment.name} description={payment.detail} trailing={payment.amount} leading={<Avatar name={payment.name} />} onPress={open} />
      ))}
  </ListGroup>
);

export const Activity: Story = {
  render: () => (
    <div style={{ maxWidth: 440 }}>
      <Tabs
        accessibilityLabel="Account activity"
        items={[
          { value: 'all', label: 'All', content: feed() },
          { value: 'upi', label: 'UPI', content: feed('upi') },
          { value: 'cards', label: 'Cards', content: feed('card') },
          {
            value: 'statements',
            label: 'Statements',
            content: (
              <ListGroup footer="Statements are password protected with your date of birth.">
                <ListItem title="October 2026" description="PDF · 214 KB" onPress={open} />
                <ListItem title="September 2026" description="PDF · 198 KB" onPress={open} />
              </ListGroup>
            ),
          },
        ]}
      />
    </div>
  ),
};

export const Faq: Story = {
  render: () => (
    <div style={{ maxWidth: 520 }}>
      <Accordion
        defaultValue={['limit']}
        items={[
          { value: 'limit', title: 'What is my daily UPI limit?', content: 'You can send up to ₹\u00A01,00,000 a day over UPI. Some merchants, like hospitals and colleges, allow up to ₹\u00A05,00,000.' },
          { value: 'fees', title: 'Are there any fees?', content: 'No. UPI payments from your account are free.' },
          { value: 'failed', title: 'My payment failed but money was debited', content: 'It comes back on its own, usually within 48 hours. If it doesn’t, raise a dispute from the transaction.' },
          { value: 'freeze', title: 'How do I freeze my card?', content: 'Open Cards and turn on Freeze. You can unfreeze it any time.' },
        ]}
      />
    </div>
  ),
};
