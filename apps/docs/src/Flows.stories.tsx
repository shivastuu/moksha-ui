import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, CopyField, OtpField, ResendTimer, StepIndicator, Timeline } from '@moksha-ui/core';

const meta = { title: 'Components/Flows' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const kyc = ['PAN', 'Aadhaar', 'Selfie', 'Done'];

export const KycSteps: Story = {
  render: function KycStepsStory() {
    const [current, setCurrent] = useState(1);
    return (
      <div style={{ display: 'grid', gap: 28, maxWidth: 440 }}>
        <StepIndicator steps={kyc} current={current} accessibilityLabel="KYC progress" />
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" size="sm" onPress={() => setCurrent(Math.max(0, current - 1))}>
            Back
          </Button>
          <Button size="sm" onPress={() => setCurrent(Math.min(kyc.length, current + 1))}>
            Next step
          </Button>
        </div>
      </div>
    );
  },
};

export const PaymentStatus: Story = {
  render: () => (
    <div style={{ maxWidth: 440 }}>
      <Timeline
        items={[
          { title: 'Payment started', description: 'UPI to swiggy@icici', time: '1:24:03 pm', status: 'complete' },
          { title: 'Debited from Savings •• 4821', time: '1:24:05 pm', status: 'complete' },
          { title: 'Sending to Swiggy', description: 'Usually takes a few seconds', status: 'current' },
          { title: 'Credited to Swiggy', status: 'upcoming' },
        ]}
      />
    </div>
  ),
};

export const FailedPayment: Story = {
  render: () => (
    <div style={{ maxWidth: 440 }}>
      <Timeline
        items={[
          { title: 'Payment started', time: '9:30:12 am', status: 'complete' },
          { title: 'Debited from Card •• 4821', time: '9:30:14 am', status: 'complete' },
          { title: 'Electricity board declined it', description: 'Your ₹ 1,840.00 will be back within 48 hours', time: '9:30:20 am', status: 'failed' },
        ]}
      />
    </div>
  ),
};

export const OtpWithResend: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <OtpField label="Enter OTP" length={6} helperText="Sent to +91 98765 •••21" />
      <ResendTimer seconds={30} onResend={() => new Promise((resolve) => setTimeout(resolve, 600))} />
    </div>
  ),
};

export const CopyDetails: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 400 }}>
      <CopyField label="UPI ID" value="shivastu@moksha" />
      <CopyField label="Account number" value="5010 0284 1934 4821" />
      <CopyField label="IFSC" value="MOKS0001234" />
    </div>
  ),
};
