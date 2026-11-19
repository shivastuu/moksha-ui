import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppBar, Breadcrumbs, IconButton, Pagination, TabBar } from './index';
import { visibleCrumbs } from './Breadcrumbs/Breadcrumbs.shared';
import { pageItems } from './Pagination/Pagination.shared';

afterEach(cleanup);

describe('Pagination', () => {
  it('lists first, last, the current page and its neighbours, with ellipses for gaps', () => {
    expect(pageItems(1, 10)).toEqual([1, 2, 3, 4, 5, 'end-ellipsis', 10]);
    expect(pageItems(5, 10)).toEqual([1, 'start-ellipsis', 4, 5, 6, 'end-ellipsis', 10]);
    expect(pageItems(10, 10)).toEqual([1, 'start-ellipsis', 6, 7, 8, 9, 10]);
    expect([pageItems(3, 5), pageItems(1, 1), pageItems(1, 2), pageItems(4, 7)]).toEqual([[1, 2, 3, 4, 5], [1], [1, 2], [1, 2, 3, 4, 5, 6, 7]]);
  });

  it('drops to 5 slots with one neighbour fewer when there is no room', () => {
    expect([pageItems(5, 12, 0), pageItems(1, 12, 0), pageItems(12, 12, 0)]).toEqual([
      [1, 'start-ellipsis', 5, 'end-ellipsis', 12],
      [1, 2, 3, 'end-ellipsis', 12],
      [1, 'start-ellipsis', 10, 11, 12],
    ]);
  });

  it('switches to the compact list when its own width is under 356px (web)', () => {
    let report: (width: number) => void = () => {};
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          report = (width) => callback([{ contentRect: { width } } as ResizeObserverEntry], this as unknown as ResizeObserver);
        }
        observe() {}
        disconnect() {}
      }
    );
    render(<Pagination pageCount={12} defaultPage={5} />);
    expect(screen.getAllByRole('button', { name: /^Page / })).toHaveLength(5);
    act(() => report(300));
    expect(screen.getAllByRole('button', { name: /^Page / }).map((button) => button.textContent)).toEqual(['1', '5', '12']);
    vi.unstubAllGlobals();
  });

  it('always shows 7 slots past 7 pages, so the buttons never jump', () => {
    for (let page = 1; page <= 20; page += 1) {
      const items = pageItems(page, 20);
      expect(items, `page ${page}`).toHaveLength(7);
      expect(items).toContain(page);
    }
  });

  it('marks the current page and stops at both ends (web)', () => {
    const onPageChange = vi.fn();
    const { rerender, container } = render(<Pagination pageCount={3} onPageChange={onPageChange} accessibilityLabel="Statements" />);
    const nav = screen.getByRole('navigation', { name: 'Statements' });
    expect(within(nav).getByRole('button', { name: 'Page 1' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('button', { name: 'Previous page' })).toHaveProperty('disabled', true);
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    fireEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onPageChange.mock.calls).toEqual([[2], [3]]);
    expect(screen.getByRole('button', { name: 'Next page' })).toHaveProperty('disabled', true);
    rerender(<Pagination pageCount={0} />);
    expect(container.innerHTML).toBe('');
  });
});

describe('Breadcrumbs (web)', () => {
  const path = [
    { label: 'Home', href: '/' },
    { label: 'Accounts', href: '/accounts' },
    { label: 'Savings •• 4821', href: '/accounts/4821' },
    { label: 'Statements', href: '/accounts/4821/statements' },
    { label: 'October 2026' },
  ];

  it('folds the middle behind "…", then expands it and moves focus to the first revealed link', () => {
    expect(visibleCrumbs([1, 2, 3, 4, 5], 4, false)).toEqual([1, null, 4, 5]);
    expect(visibleCrumbs([1, 2, 3], 4, false)).toEqual([1, 2, 3]);
    render(<Breadcrumbs items={path} />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(within(nav).getAllByRole('listitem').map((item) => item.textContent)).toEqual(['Home', '…', 'Statements', 'October 2026']);
    expect(screen.getByText('October 2026').getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('link', { name: 'Home' }).getAttribute('href')).toBe('/');
    fireEvent.click(screen.getByRole('button', { name: 'Show the full path' }));
    expect(within(nav).getAllByRole('listitem')).toHaveLength(5);
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Accounts' }));
  });
});

describe('AppBar (web)', () => {
  it('has a heading for the title, a named back button, and actions', () => {
    const onBack = vi.fn();
    render(<AppBar title="Savings account" subtitle="•• 4821" onBack={onBack} actions={<IconButton icon={<svg />} accessibilityLabel="Download statement" variant="ghost" />} />);
    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1, name: 'Savings account' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Download statement' })).toBeTruthy();
  });
});

describe('TabBar (web)', () => {
  const icon = vi.fn(() => <svg />);
  const items = [
    { value: 'home', label: 'Home', icon },
    { value: 'pay', label: 'Pay', icon, badge: 2 },
    { value: 'cards', label: 'Cards', icon },
  ];

  it('marks the current section, moves the pill, and draws icons in currentColor', () => {
    const onValueChange = vi.fn();
    const { container } = render(<TabBar items={items} onValueChange={onValueChange} />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('button', { name: 'Home' }).getAttribute('aria-current')).toBe('page');
    fireEvent.click(within(nav).getByRole('button', { name: 'Pay, 2 new' }));
    expect(onValueChange).toHaveBeenCalledWith('pay');
    expect(within(nav).getByRole('button', { name: 'Pay, 2 new' }).getAttribute('aria-current')).toBe('page');
    expect(container.querySelector<HTMLElement>('.ds-tabbar__indicator')!.style.transform).toBe('translateX(100%)');
    expect(icon).toHaveBeenCalledWith('currentColor');
    expect(container.querySelector('.ds-surface--glass')).toBeTruthy();
  });
});
