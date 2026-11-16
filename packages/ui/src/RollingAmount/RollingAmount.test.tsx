import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { RollingAmount } from '../index';

afterEach(cleanup);

const digits = (container: HTMLElement) =>
  [...container.querySelectorAll<HTMLElement>('.ds-amount__reel')].map((reel) => reel.style.getPropertyValue('--ds-digit'));

describe('RollingAmount (web)', () => {
  it('says the whole amount once, with Indian grouping, and hides it on request', () => {
    const { rerender } = render(<RollingAmount value={2458000.5} />);
    expect(screen.getByText('₹24,58,000.50')).toBeTruthy();
    rerender(<RollingAmount value={-12.5} currency="$" />);
    expect(screen.getByText('-$12.50')).toBeTruthy();
    rerender(<RollingAmount value={12.5} hidden />);
    expect(screen.getByText('Balance hidden')).toBeTruthy();
  });

  it('keeps each place on its own reel as the number grows', () => {
    const { container, rerender } = render(<RollingAmount value={9999} decimals={0} />);
    expect(digits(container)).toEqual(['9', '9', '9', '9']);
    const units = container.querySelectorAll('.ds-amount__digit')[3];

    rerender(<RollingAmount value={10000} decimals={0} />);
    expect(digits(container)).toEqual(['1', '0', '0', '0', '0']);
    // Same element, so it rolls from 9 to 0 instead of being replaced
    expect(container.querySelectorAll('.ds-amount__digit')[4]).toBe(units);
  });
});
