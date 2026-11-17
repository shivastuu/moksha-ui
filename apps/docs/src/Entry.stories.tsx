import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, ListGroup, NumberStepper, PinPad, SuccessCheck, Text, TextArea } from '@moksha-ui/core';

const meta = { title: 'Components/Entry' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const PaymentSuccess: Story = {
  render: function PaymentSuccessStory() {
    const [run, setRun] = useState(0);
    return (
      <div style={{ display: 'grid', justifyItems: 'center', gap: 12, maxWidth: 360, textAlign: 'center' }}>
        <SuccessCheck key={run} size={88} accessibilityLabel="Payment successful" />
        <Text variant="title">₹ 486.00 paid</Text>
        <Text tone="muted">to Swiggy · UPI ref 4021 8876 1290</Text>
        <div style={{ marginTop: 12 }}>
          <Button variant="secondary" size="sm" onPress={() => setRun(run + 1)}>
            Replay
          </Button>
        </div>
      </div>
    );
  },
};

/** The right PIN is 482193; anything else shows the error */
export const UpiPin: Story = {
  render: function UpiPinStory() {
    const [pin, setPin] = useState('');
    const [error, setError] = useState<string>();
    return (
      <div style={{ maxWidth: 360 }}>
        <PinPad
          label="Enter UPI PIN"
          length={6}
          value={pin}
          error={error}
          onValueChange={(next) => {
            setPin(next);
            setError(undefined);
          }}
          onComplete={(entered) => {
            if (entered !== '482193') {
              setError('Incorrect PIN. 2 attempts left');
              setPin('');
            }
          }}
        />
      </div>
    );
  },
};

export const Steppers: Story = {
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <ListGroup title="Book a flight">
        <div style={{ padding: '12px 16px' }}>
          <NumberStepper label="Adults" defaultValue={2} min={1} max={9} />
        </div>
        <div style={{ padding: '12px 16px' }}>
          <NumberStepper label="Children" defaultValue={0} max={6} />
        </div>
        <div style={{ padding: '12px 16px' }}>
          <NumberStepper label="EMI tenure" defaultValue={6} min={3} max={24} step={3} format={(months) => `${months} months`} />
        </div>
      </ListGroup>
    </div>
  ),
};

export const Note: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20, maxWidth: 400 }}>
      <TextArea label="Note for payee" placeholder="What is this payment for?" helperText="They see this with the payment" maxLength={120} />
      <TextArea label="Describe the problem" defaultValue="Money was debited twice for the same order." error="Add the order number so we can find it" maxLength={500} rows={4} />
    </div>
  ),
};
