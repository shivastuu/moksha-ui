import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { IconButton } from '../index';

afterEach(cleanup);

const Eye = () => <svg data-testid="icon" />;

describe('IconButton (web)', () => {
  it('is a button named by its label, with the icon inside', () => {
    const onPress = vi.fn();
    render(<IconButton icon={<Eye />} accessibilityLabel="Hide balance" onPress={onPress} />);
    const button = screen.getByRole('button', { name: 'Hide balance' });
    expect(button.getAttribute('type')).toBe('button');
    expect(button.className).toBe('ds-icon-button ds-icon-button--soft ds-icon-button--md');
    expect(screen.getByTestId('icon').parentElement).toBe(button);
    fireEvent.click(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('reports a toggle state, and ignores presses while disabled', () => {
    const onPress = vi.fn();
    const { rerender } = render(<IconButton icon={<Eye />} accessibilityLabel="Hide balance" pressed={false} />);
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('false');
    rerender(<IconButton icon={<Eye />} accessibilityLabel="Hide balance" pressed variant="glass" size="lg" disabled onPress={onPress} />);
    const button = screen.getByRole('button', { pressed: true });
    expect(button.className).toBe('ds-icon-button ds-icon-button--glass ds-icon-button--lg');
    fireEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});
