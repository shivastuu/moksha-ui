import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useRef, useState } from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { Drawer, Menu, Popover, Tooltip } from './index';
import { nextEnabled } from './Menu/Menu.shared';
import { placeFloating } from './utils/floating';

const showPopover = vi.fn();

// jsdom has no popover top layer and hides every [popover]; the real top layer is checked in Chrome
beforeAll(() => {
  HTMLElement.prototype.showPopover = showPopover;
  const style = document.createElement('style');
  style.textContent = '[popover]{display:block}';
  document.head.append(style);
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
  };
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('placeFloating', () => {
  const viewport = { width: 400, height: 800 };
  const size = { width: 200, height: 160 };

  it('goes on the preferred side when it fits, and flips when it does not', () => {
    expect(placeFloating({ x: 20, y: 100, width: 80, height: 40 }, size, viewport)).toEqual({ x: 20, y: 148, side: 'bottom' });
    expect(placeFloating({ x: 20, y: 700, width: 80, height: 40 }, size, viewport)).toEqual({ x: 20, y: 532, side: 'top' });
    expect(placeFloating({ x: 20, y: 100, width: 80, height: 40 }, size, viewport, 'top').side).toBe('bottom');
  });

  it('aligns to the anchor and stays inside the viewport', () => {
    const anchor = { x: 300, y: 100, width: 80, height: 40 };
    expect(placeFloating(anchor, size, viewport, 'bottom', 'end').x).toBe(180);
    expect(placeFloating(anchor, size, viewport, 'bottom', 'center').x).toBe(192);
    expect(placeFloating(anchor, size, viewport, 'bottom', 'start').x).toBe(192);
    // Too tall for both sides: the roomier one, clamped on screen
    expect(placeFloating({ x: 0, y: 500, width: 80, height: 40 }, { width: 200, height: 700 }, viewport)).toEqual({ x: 8, y: 8, side: 'top' });
  });
});

describe('Menu (web)', () => {
  const items = (onSelect: () => void) => [
    { label: 'Freeze card', onSelect },
    { label: 'Set limits', onSelect, disabled: true },
    { label: 'View PIN', onSelect },
    { label: 'Block card', onSelect, tone: 'danger' as const },
  ];

  function Harness({ onSelect }: { onSelect: () => void }) {
    const anchor = useRef<HTMLSpanElement>(null);
    const [open, setOpen] = useState(false);
    return (
      <>
        <span ref={anchor}>
          <button type="button" onClick={() => setOpen(!open)}>
            More
          </button>
        </span>
        <button type="button">Elsewhere</button>
        <Menu anchor={anchor} open={open} onClose={() => setOpen(false)} accessibilityLabel="Card actions" items={items(onSelect)} />
      </>
    );
  }

  it('skips disabled items when moving', () => {
    expect([nextEnabled(items(() => {}), 0, 1), nextEnabled(items(() => {}), 2, -1), nextEnabled(items(() => {}), 3, 1)]).toEqual([2, 0, 0]);
  });

  it('opens with focus on the first item, moves with arrows, and returns focus after a choice', () => {
    const onSelect = vi.fn();
    render(<Harness onSelect={onSelect} />);
    const trigger = screen.getByRole('button', { name: 'More' });
    fireEvent.click(trigger);
    expect(screen.getByRole('menu', { name: 'Card actions' })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Freeze card' }));
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'View PIN' }));
    fireEvent.keyDown(document.activeElement!, { key: 'End' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Block card' }));
    fireEvent.click(document.activeElement!);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('closes on Escape with focus back on the trigger, and on a press outside; the trigger toggles it', () => {
    render(<Harness onSelect={() => {}} />);
    const trigger = screen.getByRole('button', { name: 'More' });
    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect([screen.queryByRole('menu'), document.activeElement]).toEqual([null, trigger]);
    fireEvent.click(trigger);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Elsewhere' }));
    expect(screen.queryByRole('menu')).toBeNull();
    fireEvent.click(trigger);
    // A press on the trigger itself is not "outside": the trigger's own click closes it
    fireEvent.pointerDown(trigger);
    expect(screen.getByRole('menu')).toBeTruthy();
    fireEvent.click(trigger);
    expect(screen.queryByRole('menu')).toBeNull();
  });
});

describe('Popover (web)', () => {
  it('is a named dialog panel that takes focus', () => {
    function Harness() {
      const anchor = useRef<HTMLSpanElement>(null);
      return (
        <>
          <span ref={anchor}>
            <button type="button">Fee details</button>
          </span>
          <Popover anchor={anchor} open onClose={() => {}} accessibilityLabel="Fee details">
            <p>No fee on UPI.</p>
            <button type="button">Got it</button>
          </Popover>
        </>
      );
    }
    render(<Harness />);
    expect(screen.getByRole('dialog', { name: 'Fee details' }).getAttribute('popover')).toBe('manual');
    expect(showPopover).toHaveBeenCalled();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Got it' }));
  });
});

describe('Tooltip (web)', () => {
  it('shows at once on keyboard focus, after a delay on hover, and is hidden from screen readers', async () => {
    vi.useFakeTimers();
    const { container } = render(
      <Tooltip label="Copy UPI ID">
        <button type="button" aria-label="Copy UPI ID">
          ⧉
        </button>
      </Tooltip>
    );
    const button = screen.getByRole('button', { name: 'Copy UPI ID' });
    await act(async () => {
      fireEvent.focus(button);
      await vi.advanceTimersByTimeAsync(0);
    });
    const tip = container.querySelector('.ds-tooltip');
    expect([tip?.textContent, tip?.getAttribute('aria-hidden')]).toEqual(['Copy UPI ID', 'true']);
    fireEvent.blur(button);
    expect(container.querySelector('.ds-tooltip')).toBeNull();
    fireEvent.pointerEnter(button.parentElement!, { pointerType: 'mouse' });
    await act(() => vi.advanceTimersByTimeAsync(300));
    expect(container.querySelector('.ds-tooltip')).toBeNull();
    await act(() => vi.advanceTimersByTimeAsync(100));
    expect(container.querySelector('.ds-tooltip')).toBeTruthy();
  });
});

describe('Drawer (web)', () => {
  it('is a dialog that slides from the chosen side', () => {
    render(
      <Drawer open title="Filters" side="left" onClose={() => {}}>
        Pick categories
      </Drawer>
    );
    const drawer = screen.getByRole('dialog', { name: 'Filters' });
    expect(drawer.className).toBe('ds-dialog ds-dialog--drawer ds-dialog--drawer-left');
  });
});
