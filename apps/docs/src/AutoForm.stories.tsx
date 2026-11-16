import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AutoForm, Motion, Surface, defineFields, type AutoFormField } from '@shivastu/ui';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const addPayee = defineFields([
  { name: 'name', type: 'text', label: 'Payee name', required: true, autoComplete: 'name' },
  { name: 'mobile', type: 'phone', label: 'Mobile number', required: true },
  { name: 'account', type: 'account', label: 'Account number', required: true },
  {
    name: 'confirmAccount',
    type: 'account',
    label: 'Confirm account number',
    required: true,
    matches: 'account',
    maskWhenBlurred: false,
    allowPaste: false,
  },
  {
    name: 'ifsc',
    type: 'text',
    label: 'IFSC',
    required: true,
    maxLength: 11,
    format: (value) => value.toUpperCase(),
    parse: (text) => text.toUpperCase().replace(/[^A-Z0-9]/g, ''),
    validate: (value) => (/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value) ? undefined : 'Enter a valid IFSC, like HDFC0001234'),
  },
  { name: 'amount', type: 'amount', label: 'Amount', required: true, min: 1, max: 200000, helperText: 'Up to ₹ 2,00,000 per transfer' },
]);

function Result({ values }: { values: object }) {
  return (
    <Motion preset="scaleIn">
      <Surface variant="raised" padding="lg" radius="lg">
        <pre style={{ margin: 0, fontSize: 13 }}>{JSON.stringify(values, null, 2)}</pre>
      </Surface>
    </Motion>
  );
}

const meta = { title: 'Components/AutoForm' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/** Try submitting empty, then account number 000000000000 for a server-side error */
export const AddPayee: Story = {
  render: function AddPayeeStory() {
    const [sent, setSent] = useState<object>();
    return (
      <div style={{ display: 'grid', gap: 24, maxWidth: 400 }}>
        <AutoForm
          fields={addPayee}
          submitLabel="Add payee"
          onSubmit={async (values) => {
            await wait(800);
            if (/^0+$/.test(values.account)) {
              return { account: 'No account found with this number' };
            }
            setSent(values);
          }}
        />
        {sent && <Result values={sent} />}
      </div>
    );
  },
};

/** The field list is plain data, so a server can send it as JSON */
const fromServer: AutoFormField[] = JSON.parse(`[
  { "name": "email", "type": "email", "label": "Email", "required": true },
  { "name": "password", "type": "password", "label": "Password", "required": true },
  { "name": "otp", "type": "otp", "label": "Enter OTP", "length": 6, "required": true, "helperText": "Sent to your mobile number" }
]`);

export const FromJson: Story = {
  render: function FromJsonStory() {
    const [sent, setSent] = useState<object>();
    return (
      <div style={{ display: 'grid', gap: 24, maxWidth: 400 }}>
        <AutoForm fields={fromServer} submitLabel="Sign in" onSubmit={(values) => setSent(values)} />
        {sent && <Result values={sent} />}
      </div>
    );
  },
};
