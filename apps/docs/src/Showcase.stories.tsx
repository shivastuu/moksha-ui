import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AccountNumberField,
  AmountField,
  Button,
  OtpField,
  PhoneField,
  SearchField,
  Surface,
  TextField,
  ThemeProvider,
  palette,
  type ColorScheme,
} from '@shivastu/ui';

const backdrop = [
  `radial-gradient(circle at 12% 18%, ${palette.red[300]} 0, transparent 38%)`,
  `radial-gradient(circle at 88% 12%, ${palette.brand[500]} 0, transparent 42%)`,
  `radial-gradient(circle at 60% 95%, ${palette.green[300]} 0, transparent 40%)`,
  'var(--ds-color-background)',
].join(', ');

function Panel({ scheme, children }: { scheme: ColorScheme; children: ReactNode }) {
  return (
    <ThemeProvider colorScheme={scheme}>
      <div
        style={{
          background: 'var(--ds-color-background)',
          color: 'var(--ds-color-text)',
          fontFamily: 'var(--ds-font-sans)',
          padding: 28,
          borderRadius: 24,
          border: '1px solid var(--ds-color-border)',
          display: 'grid',
          gap: 20,
          alignContent: 'start',
        }}
      >
        {children}
      </div>
    </ThemeProvider>
  );
}

function HeroPanel({ scheme }: { scheme: ColorScheme }) {
  return (
    <Panel scheme={scheme}>
      <div style={{ padding: 20, borderRadius: 20, background: backdrop }}>
        <Surface variant="glass" padding="xl" radius="xl">
          <div style={{ fontSize: 13, color: 'var(--ds-color-text-muted)' }}>Card balance</div>
          <div style={{ fontSize: 30, fontWeight: 600, margin: '4px 0 16px' }}>₹ 24,580.00</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="sm">Pay bill</Button>
            <Button size="sm" variant="secondary">
              Statement
            </Button>
          </div>
        </Surface>
      </div>
      <PhoneField label="Mobile number" defaultValue="9876543210" />
      <AmountField label="Amount" defaultValue="1250000" helperText="Indian digit grouping, raw value 1250000" />
      <OtpField label="Enter OTP" defaultValue="4839" />
      <div style={{ display: 'flex', gap: 8 }}>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </Panel>
  );
}

function Hero() {
  return (
    <div id="showcase" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: 1040, padding: 8 }}>
      <HeroPanel scheme="light" />
      <HeroPanel scheme="dark" />
    </div>
  );
}

function Inputs() {
  return (
    <div id="showcase" style={{ width: 1040, padding: 8 }}>
      <Panel scheme="light">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <TextField label="Full name" placeholder="As on your PAN card" helperText="We use this on your card" />
          <TextField label="PAN" defaultValue="ABCDE1234" error="Enter a valid 10-character PAN" required />
          <PhoneField label="Mobile number" defaultValue="9876543210" />
          <AmountField label="Amount" defaultValue="2500000.75" />
          <AccountNumberField label="Account number" defaultValue="123456789012" helperText="Masked when not editing" />
          <SearchField label="Search transactions" placeholder="Search merchants or UPI IDs" />
          <OtpField label="Enter OTP" defaultValue="4839" />
          <OtpField label="Card PIN" length={4} masked defaultValue="12" />
          <TextField label="City" defaultValue="Pune" clearable helperText="Clear button built in" />
          <TextField label="Disabled" defaultValue="NY-20431" disabled />
        </div>
      </Panel>
    </div>
  );
}

function ButtonsPanel({ scheme }: { scheme: ColorScheme }) {
  return (
    <Panel scheme={scheme}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button loading>Paying</Button>
        <Button disabled>Disabled</Button>
      </div>
      <Button fullWidth>Continue</Button>
    </Panel>
  );
}

function Buttons() {
  return (
    <div id="showcase" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: 1040, padding: 8 }}>
      <ButtonsPanel scheme="light" />
      <ButtonsPanel scheme="dark" />
    </div>
  );
}

const meta = { title: 'Showcase', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const LightAndDark: StoryObj = { name: 'Light and dark', render: () => <Hero /> };

export const AllInputs: StoryObj = { name: 'Inputs', render: () => <Inputs /> };

export const AllButtons: StoryObj = { name: 'Buttons', render: () => <Buttons /> };
