import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import {
  AccountNumberField,
  AmountField,
  Button,
  OtpField,
  PhoneField,
  SearchField,
  Surface,
  TextField,
  isValidIndianMobile,
  palette,
} from '@shivastu/ui';

function Stack({ children, width = 360 }: { children: ReactNode; width?: number }) {
  return <div style={{ display: 'grid', gap: 20, maxWidth: width }}>{children}</div>;
}

const meta = {
  title: 'Components/Inputs',
  component: TextField,
  args: {
    label: 'Full name',
    placeholder: 'As on your PAN card',
    helperText: 'We use this on your card',
    onChangeText: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outline', 'filled', 'glass'] },
    size: { control: 'inline-radio', options: ['md', 'lg'] },
    inputMode: { control: 'select', options: ['text', 'numeric', 'decimal', 'tel', 'email', 'search', 'url'] },
  },
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Stack>
      <TextField {...args} />
    </Stack>
  ),
};

export const States: Story = {
  render: () => (
    <Stack>
      <TextField label="Full name" placeholder="As on your PAN card" />
      <TextField label="Email" defaultValue="asha@example.com" helperText="Statements are sent here" />
      <TextField label="PAN" defaultValue="ABCDE1234" error="Enter a valid 10-character PAN" required />
      <TextField label="Customer ID" defaultValue="NY-20431" disabled />
      <TextField label="City" defaultValue="Pune" clearable />
    </Stack>
  ),
};

export const Variants: Story = {
  render: () => (
    <div
      style={{
        padding: 28,
        borderRadius: 24,
        background: [
          `radial-gradient(circle at 15% 20%, ${palette.red[300]} 0, transparent 40%)`,
          `radial-gradient(circle at 85% 70%, ${palette.brand[500]} 0, transparent 45%)`,
          'var(--ds-color-background)',
        ].join(', '),
      }}
    >
      <Stack>
        <TextField label="Outline" placeholder="Default" />
        <TextField label="Filled" placeholder="On a surface" variant="filled" />
        <TextField label="Glass" placeholder="Over a backdrop" variant="glass" />
        <TextField label="Large" placeholder="size=lg" size="lg" />
      </Stack>
    </div>
  ),
};

export const SpecialisedFields: Story = {
  name: 'Phone, amount, account, search',
  render: () => (
    <Stack>
      <PhoneField label="Mobile number" defaultValue="9876543210" />
      <AmountField label="Amount" defaultValue="1234567.5" helperText="Max ₹ 50,00,000 per day" />
      <AccountNumberField label="Account number" defaultValue="123456789012" helperText="Masked when not editing" />
      <SearchField label="Search transactions" placeholder="Search merchants or UPI IDs" />
    </Stack>
  ),
};

export const Otp: Story = {
  name: 'OTP and PIN',
  render: () => (
    <Stack>
      <OtpField label="Enter the OTP sent to +91 98765 43210" helperText="Paste or autofill works too" />
      <OtpField label="Card PIN" length={4} masked defaultValue="12" />
      <OtpField label="Enter OTP" defaultValue="483" error="Incorrect OTP, 2 attempts left" />
    </Stack>
  ),
};

function AddBankAccount() {
  const [mobile, setMobile] = useState('');
  const [account, setAccount] = useState('');
  const [confirm, setConfirm] = useState('');
  const [amount, setAmount] = useState('');
  const mismatch = confirm.length > 0 && confirm !== account;
  const mobileError = mobile.length === 10 && !isValidIndianMobile(mobile) ? 'Enter a valid Indian mobile number' : undefined;

  return (
    <Surface variant="raised" padding="xl" radius="xl">
      <div style={{ display: 'grid', gap: 18, maxWidth: 380 }}>
        <strong style={{ fontSize: 20 }}>Add a bank account</strong>
        <PhoneField label="Mobile number linked to the account" value={mobile} onChangeText={setMobile} error={mobileError} />
        <AccountNumberField label="Account number" value={account} onChangeText={setAccount} />
        <AccountNumberField
          label="Re-enter account number"
          value={confirm}
          onChangeText={setConfirm}
          allowPaste={false}
          maskWhenBlurred={false}
          error={mismatch ? "Account numbers don't match" : undefined}
        />
        <AmountField label="Verification amount" value={amount} onChangeText={setAmount} helperText="We send ₹ 1 to confirm" />
        <Button fullWidth disabled={!account || mismatch || mobile.length !== 10}>
          Verify account
        </Button>
      </div>
    </Surface>
  );
}

export const Form: Story = {
  name: 'Form: add bank account',
  render: () => <AddBankAccount />,
};
