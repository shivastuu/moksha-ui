import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { contrastRatio, createTheme, defaultTheme, type ColorScheme } from '@moksha-ui/tokens';
import { Checkbox, RadioGroup, SegmentedControl, Switch, Tabs } from './index';
import { nextIndex } from './SegmentedControl/SegmentedControl.shared';
import { controlColors } from './utils/controls';

afterEach(cleanup);

describe('control colors', () => {
  it('meet WCAG 1.4.11 (3:1) for tracks, thumb, box borders and the tab indicator in every theme', () => {
    const themes = [defaultTheme, ...['#E11D48', '#F97316', '#FACC15', '#84CC16', '#06B6D4', '#7C3AED', '#111111', '#F5F5F5'].map((brandColor) => createTheme({ brandColor }))];
    for (const theme of themes) {
      for (const scheme of ['light', 'dark'] as ColorScheme[]) {
        const { colors } = theme.themes[scheme];
        const look = controlColors(colors);
        expect(contrastRatio(look.thumb, look.switchOn), `thumb on, ${scheme}`).toBeGreaterThanOrEqual(3);
        expect(contrastRatio(look.switchOff, colors.background), `off track, ${scheme}`).toBeGreaterThanOrEqual(3);
        expect(contrastRatio(look.boxBorder, colors.background), `box border, ${scheme}`).toBeGreaterThanOrEqual(3);
        expect(contrastRatio(look.indicator, colors.background), `tab indicator, ${scheme}`).toBeGreaterThanOrEqual(3);
      }
    }
  });
});

describe('Switch (web)', () => {
  it('is a switch named by its label that toggles from the label too', () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="International payments" description="Use your card abroad" onCheckedChange={onCheckedChange} />);
    // Named by the label alone; the description is announced separately
    const control = screen.getByRole('switch', { name: 'International payments', description: 'Use your card abroad' });
    expect(control.getAttribute('aria-checked')).toBe('false');
    expect(document.getElementById(control.getAttribute('aria-describedby')!)?.textContent).toBe('Use your card abroad');
    fireEvent.click(screen.getByText('International payments'));
    expect(control.getAttribute('aria-checked')).toBe('true');
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
  });

  it('stays where a controlled parent puts it, and ignores clicks while disabled', () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(<Switch checked={false} accessibilityLabel="Freeze card" onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole('switch', { name: 'Freeze card' });
    fireEvent.click(control);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(control.getAttribute('aria-checked')).toBe('false');
    rerender(<Switch checked accessibilityLabel="Freeze card" disabled onCheckedChange={onCheckedChange} />);
    fireEvent.click(control);
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
  });
});

describe('Checkbox (web)', () => {
  it('is a real checkbox: toggles, submits its name, and shows a mixed state', () => {
    const { container, rerender } = render(<Checkbox label="Remember this device" name="remember" />);
    const box = screen.getByRole('checkbox', { name: 'Remember this device' }) as HTMLInputElement;
    expect(box.name).toBe('remember');
    fireEvent.click(box);
    expect(box.checked).toBe(true);
    expect(container.querySelector('.ds-checkbox')?.getAttribute('data-state')).toBe('checked');
    rerender(<Checkbox label="Remember this device" name="remember" checked="mixed" />);
    expect(box.indeterminate).toBe(true);
    expect(container.querySelector('.ds-checkbox')?.getAttribute('data-state')).toBe('mixed');
  });
});

describe('RadioGroup (web)', () => {
  const accounts = [
    { value: 'savings', label: 'Savings •• 4821', description: '₹ 24,580.00' },
    { value: 'salary', label: 'Salary •• 1034', description: '₹ 1,02,400.00' },
    { value: 'joint', label: 'Joint •• 7790', disabled: true },
  ];

  it('is a named group of real radios that share a name', () => {
    const onValueChange = vi.fn();
    render(<RadioGroup label="Pay from" options={accounts} defaultValue="savings" onValueChange={onValueChange} />);
    expect(screen.getByRole('group', { name: 'Pay from' })).toBeTruthy();
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(new Set(radios.map((radio) => radio.name)).size).toBe(1);
    expect(screen.getByRole('radio', { name: 'Savings •• 4821' })).toHaveProperty('checked', true);
    fireEvent.click(screen.getByRole('radio', { name: 'Salary •• 1034' }));
    expect(onValueChange).toHaveBeenCalledWith('salary');
    expect(screen.getByRole('radio', { name: 'Joint •• 7790' })).toHaveProperty('disabled', true);
    expect(screen.getByText('₹ 1,02,400.00').id).toBe(screen.getByRole('radio', { name: 'Salary •• 1034' }).getAttribute('aria-describedby'));
  });
});

describe('SegmentedControl (web)', () => {
  const periods = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ];

  it('moves with arrow keys, wrapping, and only the chosen option is tabbable', () => {
    expect([nextIndex('ArrowRight', 2, 3), nextIndex('ArrowLeft', 0, 3), nextIndex('Home', 2, 3), nextIndex('End', 0, 3), nextIndex('a', 0, 3)]).toEqual([0, 2, 0, 2, null]);
    const { container } = render(<SegmentedControl options={periods} defaultValue="month" accessibilityLabel="Statement period" />);
    expect(screen.getByRole('radiogroup', { name: 'Statement period' })).toBeTruthy();
    const month = screen.getByRole('radio', { name: 'Month' });
    expect([month.getAttribute('aria-checked'), month.tabIndex, screen.getByRole('radio', { name: 'Week' }).tabIndex]).toEqual(['true', 0, -1]);
    fireEvent.keyDown(month, { key: 'ArrowRight' });
    const year = screen.getByRole('radio', { name: 'Year' });
    expect([year.getAttribute('aria-checked'), document.activeElement]).toEqual(['true', year]);
    fireEvent.keyDown(year, { key: 'ArrowRight' });
    expect(screen.getByRole('radio', { name: 'Week' }).getAttribute('aria-checked')).toBe('true');
    expect(container.querySelector<HTMLElement>('.ds-segmented__indicator')!.style.transform).toBe('translateX(0%)');
  });
});

describe('Tabs (web)', () => {
  const activity = [
    { value: 'all', label: 'All', content: <p>Every transaction</p> },
    { value: 'upi', label: 'UPI', content: <p>UPI only</p> },
    { value: 'cards', label: 'Cards', content: <p>Card spends</p> },
  ];

  // jsdom has no layout: each tab sits 100px after the last and is 10px per letter wide
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
    vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(function (this: HTMLElement) {
      return [...this.parentElement!.children].indexOf(this) * 100;
    });
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) {
      return this.textContent!.length * 10;
    });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('follows the WAI-ARIA tabs pattern: one tabbable tab, arrow keys, a labelled panel', () => {
    render(<Tabs items={activity} accessibilityLabel="Account activity" />);
    expect(screen.getByRole('tablist', { name: 'Account activity' })).toBeTruthy();
    const all = screen.getByRole('tab', { name: 'All' });
    expect([all.getAttribute('aria-selected'), all.tabIndex, screen.getByRole('tab', { name: 'UPI' }).tabIndex]).toEqual(['true', 0, -1]);
    expect(screen.getByRole('tabpanel', { name: 'All' }).textContent).toBe('Every transaction');
    fireEvent.keyDown(all, { key: 'End' });
    const cards = screen.getByRole('tab', { name: 'Cards' });
    expect([cards.getAttribute('aria-selected'), document.activeElement]).toEqual(['true', cards]);
    expect(screen.getByRole('tabpanel', { name: 'Cards' }).textContent).toBe('Card spends');
    expect(cards.getAttribute('aria-controls')).toBe(screen.getByRole('tabpanel').id);
  });

  it('slides the underline to the measured position and width of the chosen tab', () => {
    const onValueChange = vi.fn();
    const { container } = render(<Tabs items={activity} accessibilityLabel="Account activity" onValueChange={onValueChange} />);
    const bar = () => container.querySelector<HTMLElement>('.ds-tabs__indicator')!.style;
    expect([bar().transform, bar().width]).toEqual(['translateX(0px)', '30px']);
    fireEvent.click(screen.getByRole('tab', { name: 'Cards' }));
    expect(onValueChange).toHaveBeenCalledWith('cards');
    expect([bar().transform, bar().width]).toEqual(['translateX(200px)', '50px']);
  });
});
