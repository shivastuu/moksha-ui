import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banner, BottomSheet, Button, Dialog, SnackbarProvider, useSnackbar } from '@shivastu/ui';

const meta = { title: 'Components/Overlays' } satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Banners: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
      <Banner title="New card on the way">It reaches you in 3 to 5 working days.</Banner>
      <Banner tone="success">₹ 2,500.00 sent to Asha Rao</Banner>
      <Banner tone="warning" title="KYC pending" action={{ label: 'Complete KYC', onPress: () => {} }} onDismiss={() => {}}>
        Finish it by 30 November to keep using your card.
      </Banner>
      <Banner tone="danger" title="Payment failed" action={{ label: 'Try again', onPress: () => {} }}>
        Your bank declined the payment. No money was taken.
      </Banner>
    </div>
  ),
};

/** On screens narrower than 640px it opens as a bottom sheet */
export const ConfirmDialog: Story = {
  render: function ConfirmDialogStory() {
    const [open, setOpen] = useState(false);
    const [blocked, setBlocked] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
        <Button variant="secondary" onPress={() => setOpen(true)}>
          {blocked ? 'Card blocked' : 'Block card'}
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Block your card?"
          actions={
            <>
              <Button variant="ghost" onPress={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onPress={() => {
                  setBlocked(true);
                  setOpen(false);
                }}
              >
                Block card
              </Button>
            </>
          }
        >
          Payments and withdrawals stop right away. You can unblock it later from Card settings.
        </Dialog>
      </div>
    );
  },
};

const accounts = ['Savings •• 4821', 'Salary •• 1034', 'Joint •• 7790'];

export const AccountSheet: Story = {
  render: function AccountSheetStory() {
    const [open, setOpen] = useState(false);
    const [account, setAccount] = useState(accounts[0]);
    return (
      <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
        <Button variant="secondary" onPress={() => setOpen(true)}>{`Pay from ${account}`}</Button>
        <BottomSheet open={open} onClose={() => setOpen(false)} title="Pay from">
          <div style={{ display: 'grid', gap: 8 }}>
            {accounts.map((name) => (
              <Button
                key={name}
                fullWidth
                variant={name === account ? 'primary' : 'secondary'}
                onPress={() => {
                  setAccount(name);
                  setOpen(false);
                }}
              >
                {name}
              </Button>
            ))}
          </div>
        </BottomSheet>
      </div>
    );
  },
};

function SnackbarButtons() {
  const snackbar = useSnackbar();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button variant="secondary" onPress={() => snackbar.show('UPI ID copied')}>
        Copy UPI ID
      </Button>
      <Button
        variant="secondary"
        onPress={() =>
          snackbar.show({
            message: 'Payee deleted',
            action: { label: 'Undo', onPress: () => snackbar.show('Payee restored') },
          })
        }
      >
        Delete payee
      </Button>
    </div>
  );
}

/** Hover or focus a snackbar to keep it on screen */
export const Snackbars: Story = {
  render: () => (
    <SnackbarProvider>
      <SnackbarButtons />
    </SnackbarProvider>
  ),
};
