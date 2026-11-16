import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { BankCard } from '../index';

afterEach(cleanup);

const card = { last4: '4821', holder: 'Shivastu Shrivastava', expiry: '08/29' };

describe('BankCard (web)', () => {
  it('reads as one image with the details that matter', () => {
    render(<BankCard {...card} frozen />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe(
      'Moksha card ending in 4821, Shivastu Shrivastava, expires 08/29, frozen'
    );
  });

  it('marks flipped and frozen states for the CSS', () => {
    const { rerender } = render(<BankCard {...card} />);
    const root = screen.getByRole('img');
    expect([root.dataset.flipped, root.dataset.frozen]).toEqual([undefined, undefined]);
    rerender(<BankCard {...card} flipped frozen />);
    expect([root.dataset.flipped, root.dataset.frozen]).toEqual(['true', 'true']);
  });

  it('follows the pointer, rests when it leaves, and can stay still', () => {
    const { rerender } = render(<BankCard {...card} />);
    const root = screen.getByRole('img');
    root.getBoundingClientRect = () => ({ left: 100, top: 50, width: 200, height: 126 }) as DOMRect;
    fireEvent.pointerMove(root, { clientX: 150, clientY: 113 });
    expect([root.style.getPropertyValue('--ds-card-x'), root.style.getPropertyValue('--ds-card-y')]).toEqual(['0.25', '0.5']);
    fireEvent.pointerLeave(root);
    expect(root.style.getPropertyValue('--ds-card-x')).toBe('');

    rerender(<BankCard {...card} interactive={false} />);
    fireEvent.pointerMove(root, { clientX: 150, clientY: 113 });
    expect(root.style.getPropertyValue('--ds-card-x')).toBe('');
  });
});
