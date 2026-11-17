import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CardStack, Select, Sidebar } from './index';
import { depthOf, stackLook } from './CardStack/CardStack.shared';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Select (web)', () => {
  const banks = [
    { value: 'hdfc', label: 'HDFC Bank' },
    { value: 'icici', label: 'ICICI Bank' },
    { value: 'yes', label: 'Yes Bank', disabled: true },
  ];

  it('is a labelled native select with a placeholder that cannot be chosen again', () => {
    const onValueChange = vi.fn();
    render(<Select label="Bank" options={banks} placeholder="Choose a bank" helperText="Where your salary comes in" onValueChange={onValueChange} name="bank" />);
    const select = screen.getByRole('combobox', { name: 'Bank', description: 'Where your salary comes in' }) as HTMLSelectElement;
    expect([select.tagName, select.name, select.value, select.hasAttribute('data-empty')]).toEqual(['SELECT', 'bank', '', true]);
    expect(screen.getByRole('option', { name: 'Choose a bank' })).toHaveProperty('disabled', true);
    expect(screen.getByRole('option', { name: 'Yes Bank' })).toHaveProperty('disabled', true);
    fireEvent.change(select, { target: { value: 'icici' } });
    expect(onValueChange).toHaveBeenCalledWith('icici');
    expect(select.hasAttribute('data-empty')).toBe(false);
  });

  it('marks an error', () => {
    render(<Select label="Bank" options={banks} error="Choose your bank" />);
    expect(screen.getByRole('combobox', { name: 'Bank' }).getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('Choose your bank')).toBeTruthy();
  });
});

describe('Sidebar (web)', () => {
  const icon = vi.fn(() => <svg />);
  const sections = [
    { items: [{ value: 'home', label: 'Home', icon }] },
    {
      title: 'Money',
      items: [
        { value: 'accounts', label: 'Accounts', icon },
        { value: 'requests', label: 'Requests', icon, count: 3 },
      ],
    },
  ];

  it('marks the current page, names counts, and slides the pill to the measured row', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockImplementation(function (this: HTMLElement) {
      return this.textContent === 'Requests3' ? 120 : 0;
    });
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(40);
    const onValueChange = vi.fn();
    const { container } = render(<Sidebar sections={sections} onValueChange={onValueChange} />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('button', { name: 'Home' }).getAttribute('aria-current')).toBe('page');
    expect(within(screen.getByRole('list', { name: 'Money' })).getAllByRole('listitem')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Requests, 3 new' }));
    expect(onValueChange).toHaveBeenCalledWith('requests');
    expect(container.querySelector<HTMLElement>('.ds-sidebar__indicator')!.style.transform).toBe('translateY(120px)');
    expect(icon).toHaveBeenCalledWith('currentColor');
  });
});

describe('CardStack', () => {
  const cards = ['Moksha •• 4821', 'Moksha Metal •• 2290', 'Travel •• 7712'].map((label) => ({ key: label, label, card: <div>{label}</div> }));

  it('counts depth from the front card, wrapping around, and steps each card back', () => {
    expect([0, 1, 2].map((position) => depthOf(position, 1, 3))).toEqual([2, 0, 1]);
    expect(stackLook(2)).toEqual({ y: -32, scale: 0.9, brightness: 0.76 });
  });

  it('shows the front card, offers the rest as buttons, and announces a change (web)', () => {
    const onIndexChange = vi.fn();
    render(<CardStack cards={cards} onIndexChange={onIndexChange} />);
    const items = within(screen.getByRole('list', { name: 'Your cards' })).getAllByRole('listitem');
    expect(items.map((item) => item.getAttribute('aria-current'))).toEqual(['true', null, null]);
    expect(screen.queryByRole('button', { name: 'Show Moksha •• 4821' })).toBeNull();
    expect(items[1]!.querySelector('[inert]')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Show Travel •• 7712' }));
    expect(onIndexChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole('status').textContent).toBe('Showing Travel •• 7712');
    expect(items[2]!.style.transform).toBe('translateY(0px) scale(1)');
    expect(items[0]!.style.transform).toBe('translateY(-16px) scale(0.95)');
  });
});
