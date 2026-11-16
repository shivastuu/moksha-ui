import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Motion, OtpField, Stagger, Surface, TextField, type MotionPreset } from 'tandemui';

const presets: MotionPreset[] = ['fade', 'fadeUp', 'fadeDown', 'scaleIn', 'slideUp'];

/** Remounts its content so the entrance plays again */
function Replay({ children }: { children: (run: number) => ReactNode }) {
  const [run, setRun] = useState(0);
  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'start' }}>
      <Button variant="secondary" size="sm" onPress={() => setRun(run + 1)}>
        Replay
      </Button>
      {children(run)}
    </div>
  );
}

const meta = { title: 'Foundations/Motion' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Presets: Story = {
  render: () => (
    <Replay>
      {(run) => (
        <div key={run} style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {presets.map((preset) => (
            <Motion key={preset} preset={preset} duration="slow">
              <Surface variant="raised" padding="lg" radius="lg" shadow="sm">
                <code>{preset}</code>
              </Surface>
            </Motion>
          ))}
        </div>
      )}
    </Replay>
  ),
};

const payments = [
  ['Swiggy', '₹ 486.00'],
  ['Uber', '₹ 212.50'],
  ['Amazon', '₹ 2,399.00'],
  ['Electricity bill', '₹ 1,840.00'],
];

export const StaggeredList: Story = {
  render: () => (
    <Replay>
      {(run) => (
        <div key={run} style={{ display: 'grid', gap: 8, width: 320 }}>
          <Stagger>
            {payments.map(([name, amount]) => (
              <Surface key={name} variant="raised" padding="md" radius="md">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{name}</span>
                  <strong>{amount}</strong>
                </div>
              </Surface>
            ))}
          </Stagger>
        </div>
      )}
    </Replay>
  ),
};

export const ErrorShake: Story = {
  render: function ErrorShakeStory() {
    const [invalid, setInvalid] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 20, maxWidth: 360 }}>
        <TextField label="PAN" defaultValue="ABCDE1234" error={invalid ? 'Enter a valid PAN' : undefined} />
        <OtpField label="Enter OTP" defaultValue="4821" length={4} error={invalid ? 'Wrong OTP, try again' : undefined} />
        <Button onPress={() => setInvalid(!invalid)}>{invalid ? 'Clear errors' : 'Show errors'}</Button>
      </div>
    );
  },
};
