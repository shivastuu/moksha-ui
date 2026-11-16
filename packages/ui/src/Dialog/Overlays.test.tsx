import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { Banner, Button, Dialog, SnackbarProvider, useSnackbar, type SnackbarOptions } from '../index';

// jsdom has no showModal; real focus trapping, Escape and focus restore are checked in Chrome
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('Banner (web)', () => {
  it('interrupts screen readers only for danger, and wires its buttons', () => {
    const onPress = vi.fn();
    const onDismiss = vi.fn();
    const { rerender } = render(
      <Banner tone="warning" title="KYC pending" action={{ label: 'Complete KYC', onPress }} onDismiss={onDismiss}>
        Finish it to keep using your card.
      </Banner>
    );
    expect(screen.getByRole('status').className).toBe('ds-banner ds-banner--warning');
    fireEvent.click(screen.getByRole('button', { name: 'Complete KYC' }));
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect([onPress.mock.calls.length, onDismiss.mock.calls.length]).toEqual([1, 1]);

    rerender(<Banner tone="danger">Payment failed</Banner>);
    expect(screen.getByRole('alert').textContent).toBe('Payment failed');
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('Dialog (web)', () => {
  function Example({ onClose, dismissible, open = true }: { onClose: () => void; dismissible?: boolean; open?: boolean }) {
    return (
      <Dialog open={open} title="Block card?" onClose={onClose} dismissible={dismissible} testID="panel" actions={<Button>Block</Button>}>
        You can unblock it later.
      </Dialog>
    );
  }

  it('opens as a modal named by its title', () => {
    const { rerender } = render(<Example open={false} onClose={vi.fn()} />);
    const dialog = document.querySelector('dialog')!;
    expect(dialog.open).toBe(false);
    expect(screen.queryByText('Block card?')).toBeNull();

    rerender(<Example onClose={vi.fn()} />);
    expect(dialog.open).toBe(true);
    expect(screen.getByRole('dialog', { name: 'Block card?' })).toBe(dialog);
    expect(screen.getByRole('heading', { name: 'Block card?' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Block' })).toBeTruthy();

    rerender(<Example open={false} onClose={vi.fn()} />);
    expect(dialog.open).toBe(false);
  });

  it('closes on Escape and on a backdrop click, but not on a click inside', () => {
    const onClose = vi.fn();
    render(<Example onClose={onClose} />);
    const dialog = document.querySelector('dialog')!;
    fireEvent.click(screen.getByTestId('panel'));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    fireEvent.click(dialog);
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(dialog.open).toBe(true);
  });

  it('stays open when not dismissible', () => {
    const onClose = vi.fn();
    render(<Example onClose={onClose} dismissible={false} />);
    const dialog = document.querySelector('dialog')!;
    const cancel = new Event('cancel', { cancelable: true });
    fireEvent(dialog, cancel);
    fireEvent.click(dialog);
    expect(cancel.defaultPrevented).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('Snackbar (web)', () => {
  function Trigger({ options }: { options: (SnackbarOptions | string)[] }) {
    const snackbar = useSnackbar();
    return <button onClick={() => options.forEach(snackbar.show)}>Show</button>;
  }

  const show = (...options: (SnackbarOptions | string)[]) => {
    render(
      <SnackbarProvider>
        <Trigger options={options} />
      </SnackbarProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Show' }));
  };

  const message = () => screen.getByRole('status').textContent;

  it('shows messages one after another in the live region, each for the theme duration', () => {
    vi.useFakeTimers();
    show('Copied UPI ID', 'Card frozen');
    expect(message()).toBe('Copied UPI ID');
    act(() => vi.advanceTimersByTime(3999));
    expect(message()).toBe('Copied UPI ID');
    act(() => vi.advanceTimersByTime(1));
    expect(message()).toBe('Card frozen');
    act(() => vi.advanceTimersByTime(4000));
    expect(message()).toBe('');
  });

  it('pauses while hovered, then finishes the time that was left', () => {
    vi.useFakeTimers();
    show({ message: 'Payment sent', duration: 1000 });
    act(() => vi.advanceTimersByTime(600));
    const snackbar = screen.getByText('Payment sent').parentElement!;
    fireEvent.mouseEnter(snackbar);
    act(() => vi.advanceTimersByTime(5000));
    expect(message()).toBe('Payment sent');

    fireEvent.mouseLeave(snackbar);
    act(() => vi.advanceTimersByTime(399));
    expect(message()).toBe('Payment sent');
    act(() => vi.advanceTimersByTime(1));
    expect(message()).toBe('');
  });

  it('runs the action and hides', () => {
    const onPress = vi.fn();
    show({ message: 'Payee deleted', action: { label: 'Undo', onPress } });
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(message()).toBe('');
  });

  it('explains a missing provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Trigger options={[]} />)).toThrow('useSnackbar needs a SnackbarProvider');
  });
});
