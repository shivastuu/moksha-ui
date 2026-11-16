import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton, RollingAmount, Surface, ThemeProvider, palette } from '@shivastu/ui';

const Icon = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const icons = {
  eye: (
    <Icon>
      <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </Icon>
  ),
  eyeOff: (
    <Icon>
      <path d="M3 3l18 18M10.6 5.6A10 10 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.7 3.5M6.3 6.8C3.9 8.4 2.5 12 2.5 12s3.5 6.5 9.5 6.5a9 9 0 0 0 4.2-1" />
    </Icon>
  ),
  add: (
    <Icon>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  ),
  send: (
    <Icon>
      <path d="M7 17 17 7M8 7h9v9" />
    </Icon>
  ),
  scan: (
    <Icon>
      <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M4 12h16" />
    </Icon>
  ),
};

const stage = {
  display: 'grid',
  placeItems: 'center',
  minHeight: 560,
  margin: -32,
  padding: 32,
  boxSizing: 'border-box' as const,
  fontFamily: 'var(--ds-font-sans)',
  background: [
    `radial-gradient(55% 45% at 22% 8%, ${palette.brand[600]}66 0%, transparent 70%)`,
    `radial-gradient(40% 35% at 85% 92%, ${palette.green[500]}33 0%, transparent 70%)`,
    palette.slate[950],
  ].join(', '),
};

function Action({ icon, label, variant, onPress }: { icon: ReactNode; label: string; variant: 'solid' | 'glass'; onPress: () => void }) {
  return (
    <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
      <IconButton icon={icon} accessibilityLabel={label} variant={variant} size="lg" onPress={onPress} />
      <span style={{ fontSize: 12, color: 'var(--ds-color-text-muted)' }}>{label}</span>
    </div>
  );
}

const meta = { title: 'Blocks/Balance card', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const BalanceCard: StoryObj<typeof meta> = {
  render: function BalanceCardStory() {
    const [balance, setBalance] = useState(24580);
    const [today, setToday] = useState(0);
    const [hidden, setHidden] = useState(false);
    const add = (amount: number) => {
      setBalance(balance + amount);
      setToday(today + amount);
    };
    return (
      <ThemeProvider colorScheme="dark">
        <div style={stage}>
          <div style={{ width: '100%', maxWidth: 380 }}>
            <Surface variant="glass" padding="xl" radius="xl" shadow="lg">
              <div style={{ display: 'grid', gap: 20, color: 'var(--ds-color-text)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: 'var(--ds-color-text-muted)' }}>Available balance</span>
                  <IconButton
                    icon={hidden ? icons.eyeOff : icons.eye}
                    accessibilityLabel="Hide balance"
                    pressed={hidden}
                    variant="ghost"
                    size="sm"
                    onPress={() => setHidden(!hidden)}
                  />
                </div>
                <div style={{ display: 'grid', gap: 10 }}>
                  <RollingAmount value={balance} size="hero" hidden={hidden} />
                  <span
                    style={{
                      justifySelf: 'start',
                      padding: '4px 10px',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--ds-color-success)',
                      background: 'color-mix(in oklab, var(--ds-color-success) 14%, transparent)',
                    }}
                  >
                    {hidden ? 'Hidden' : `↑ ₹${today.toLocaleString('en-IN')} today`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: 4 }}>
                  <Action icon={icons.add} label="Add money" variant="solid" onPress={() => add(12500)} />
                  <Action icon={icons.send} label="Send" variant="glass" onPress={() => setBalance(Math.max(0, balance - 2499.5))} />
                  <Action icon={icons.scan} label="Scan & pay" variant="glass" onPress={() => setBalance(Math.max(0, balance - 180))} />
                </div>
              </div>
            </Surface>
          </div>
        </div>
      </ThemeProvider>
    );
  },
};
