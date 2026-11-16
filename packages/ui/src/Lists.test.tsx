import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Accordion, ListGroup, ListItem, Switch } from './index';
import { toggle } from './Accordion/Accordion.shared';

afterEach(cleanup);

describe('ListItem (web)', () => {
  it('is a plain row without onPress, and a button named by title and value with it', () => {
    const onPress = vi.fn();
    const { container, rerender } = render(<ListItem title="Card limit" trailing="₹ 50,000" />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(container.querySelector('svg')).toBeNull();
    rerender(<ListItem title="Language" description="Used in the app and SMS" trailing="English" onPress={onPress} />);
    const row = screen.getByRole('button', { name: 'Language English', description: 'Used in the app and SMS' });
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    fireEvent.click(row);
    expect(onPress).toHaveBeenCalledTimes(1);
    rerender(<ListItem title="Language" trailing="English" onPress={onPress} disabled />);
    fireEvent.click(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('keeps a control in the trailing slot as its own control', () => {
    render(<ListItem title="Card lock" trailing={<Switch accessibilityLabel="Lock card" />} />);
    expect(screen.getByRole('switch', { name: 'Lock card' })).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('ListGroup (web)', () => {
  it('is a list named by its title, one item per row, skipping conditional gaps', () => {
    const biometrics: boolean = false;
    render(
      <ListGroup title="Security" footer="Changes apply on all your devices">
        <ListItem title="App lock" />
        {biometrics && <ListItem title="Face ID" />}
        <ListItem title="Change MPIN" onPress={() => {}} />
      </ListGroup>
    );
    const list = screen.getByRole('list', { name: 'Security' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Changes apply on all your devices')).toBeTruthy();
  });
});

describe('Accordion (web)', () => {
  const faq = [
    { value: 'limit', title: 'What is my daily UPI limit?', content: 'Up to ₹ 1,00,000 a day.' },
    { value: 'fees', title: 'Are there any fees?', content: 'No. UPI payments are free.' },
  ];

  it('opens one section at a time, or several with multiple', () => {
    expect([toggle([], 'a', false), toggle(['a'], 'b', false), toggle(['a'], 'b', true), toggle(['a', 'b'], 'a', true)]).toEqual([['a'], ['b'], ['a', 'b'], ['b']]);
  });

  it('is a heading with a button that expands a labelled region, kept out of reach while closed', () => {
    const onValueChange = vi.fn();
    render(<Accordion items={faq} headingLevel={2} onValueChange={onValueChange} />);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);
    const limit = screen.getByRole('button', { name: 'What is my daily UPI limit?' });
    const panel = document.getElementById(limit.getAttribute('aria-controls')!)!;
    expect([limit.getAttribute('aria-expanded'), panel.hasAttribute('inert')]).toEqual(['false', true]);
    fireEvent.click(limit);
    expect([limit.getAttribute('aria-expanded'), panel.hasAttribute('inert')]).toEqual(['true', false]);
    expect(screen.getByRole('region', { name: 'What is my daily UPI limit?' }).textContent).toBe('Up to ₹ 1,00,000 a day.');
    fireEvent.click(screen.getByRole('button', { name: 'Are there any fees?' }));
    expect(limit.getAttribute('aria-expanded')).toBe('false');
    expect(onValueChange).toHaveBeenLastCalledWith(['fees']);
  });
});
