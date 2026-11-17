import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CopyField, ResendTimer, StepIndicator, Timeline } from './index';
import { clock } from './ResendTimer/ResendTimer.shared';
import { stepSummary } from './StepIndicator/StepIndicator.shared';
import { timelineLabel } from './Timeline/Timeline.shared';

afterEach(cleanup);

describe('ResendTimer (web)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('formats minutes and seconds', () => {
    expect([clock(5), clock(30), clock(75), clock(600)]).toEqual(['0:05', '0:30', '1:15', '10:00']);
  });

  it('counts down, ignores presses while waiting, then restarts once a resend resolves', async () => {
    const onResend = vi.fn().mockResolvedValue(undefined);
    render(<ResendTimer seconds={30} onResend={onResend} />);
    const button = screen.getByRole('button');
    expect([button.textContent, button.getAttribute('aria-disabled')]).toEqual(['Resend code in 0:30', 'true']);
    fireEvent.click(button);
    expect(onResend).not.toHaveBeenCalled();
    await act(() => vi.advanceTimersByTimeAsync(12_000));
    expect(button.textContent).toBe('Resend code in 0:18');
    await act(() => vi.advanceTimersByTimeAsync(18_000));
    expect([button.textContent, button.getAttribute('aria-disabled')]).toEqual(['Resend code', 'false']);
    await act(async () => fireEvent.click(button));
    expect(onResend).toHaveBeenCalledTimes(1);
    expect(button.textContent).toBe('Resend code in 0:30');
  });

  it('stays ready when the resend fails, so the user can retry at once', async () => {
    const onResend = vi.fn().mockRejectedValue(new Error('network'));
    render(<ResendTimer seconds={1} onResend={onResend} />);
    await act(() => vi.advanceTimersByTimeAsync(1000));
    await act(async () => fireEvent.click(screen.getByRole('button')));
    expect(onResend).toHaveBeenCalledTimes(1);
    expect([screen.getByRole('button').textContent, screen.getByRole('button').getAttribute('aria-disabled')]).toEqual(['Resend code', 'false']);
  });

  it('reads the clock, so a sleeping tab still shows the right time', async () => {
    render(<ResendTimer seconds={30} onResend={() => {}} />);
    // 20s pass with no timer firing, like a throttled background tab
    vi.setSystemTime(Date.now() + 20_000);
    await act(() => vi.advanceTimersByTimeAsync(250));
    expect(screen.getByRole('button').textContent).toBe('Resend code in 0:10');
  });
});

describe('CopyField (web)', () => {
  const field = (onCopy?: (value: string) => Promise<unknown>) => render(<CopyField label="UPI ID" value="shivastu@moksha" onCopy={onCopy} />);

  it('shows the check and announces only after the copy resolves, then clears it', async () => {
    vi.useFakeTimers();
    const onCopy = vi.fn().mockResolvedValue(undefined);
    field(onCopy);
    const button = screen.getByRole('button', { name: 'Copy UPI ID' });
    await act(async () => fireEvent.click(button));
    expect(onCopy).toHaveBeenCalledWith('shivastu@moksha');
    expect([button.hasAttribute('data-copied'), screen.getByRole('status').textContent]).toEqual([true, 'UPI ID copied']);
    await act(() => vi.advanceTimersByTimeAsync(2000));
    expect([button.hasAttribute('data-copied'), screen.getByRole('status').textContent]).toEqual([false, '']);
    vi.useRealTimers();
  });

  it('never claims a failed copy, and selects the value for Ctrl/Cmd+C instead', async () => {
    field(vi.fn().mockRejectedValue(new Error('denied')));
    const button = screen.getByRole('button', { name: 'Copy UPI ID' });
    await act(async () => fireEvent.click(button));
    expect([button.hasAttribute('data-copied'), screen.getByRole('status').textContent]).toEqual([false, '']);
    expect(window.getSelection()?.toString()).toBe('shivastu@moksha');
  });

  it('uses the system clipboard by default', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    field();
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Copy UPI ID' })));
    expect(writeText).toHaveBeenCalledWith('shivastu@moksha');
  });
});

describe('StepIndicator (web)', () => {
  const kyc = ['PAN', 'Aadhaar', 'Selfie', 'Done'];

  it('is an ordered list with the current step marked and done steps spoken as done', () => {
    render(<StepIndicator steps={kyc} current={1} accessibilityLabel="KYC progress" />);
    const items = within(screen.getByRole('list', { name: 'KYC progress' })).getAllByRole('listitem');
    expect(items.map((item) => item.getAttribute('data-state'))).toEqual(['complete', 'current', 'upcoming', 'upcoming']);
    expect(items.map((item) => item.getAttribute('aria-current'))).toEqual([null, 'step', null, null]);
    expect(items[0]!.querySelector('.ds-steps__label')?.textContent).toBe('Done: PAN');
    expect([stepSummary(kyc, 1), stepSummary(kyc, 4)]).toEqual(['Step 2 of 4: Aadhaar', 'All 4 steps done']);
  });
});

describe('Timeline (web)', () => {
  const payment = [
    { title: 'Payment started', time: '1:24:03 pm', status: 'complete' },
    { title: 'Debited from Savings •• 4821', time: '1:24:05 pm', status: 'complete' },
    { title: 'Sending to Swiggy', description: 'Usually takes a few seconds', status: 'current' },
    { title: 'Credited', status: 'upcoming' },
  ] as const;

  it('speaks each status before its title and marks the current step', () => {
    render(<Timeline items={[...payment]} />);
    const items = screen.getAllByRole('listitem');
    expect(items.map((item) => item.querySelector('.ds-timeline__title')?.textContent)).toEqual([
      'Done: Payment started',
      'Done: Debited from Savings •• 4821',
      'In progress: Sending to Swiggy',
      'Next: Credited',
    ]);
    expect(items[2]!.getAttribute('aria-current')).toBe('step');
    expect(timelineLabel(payment[2])).toBe('In progress: Sending to Swiggy, Usually takes a few seconds');
  });
});
