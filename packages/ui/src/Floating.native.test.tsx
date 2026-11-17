import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { useRef, useState } from 'react';
import { Pressable, Text, View, type HostInstance } from 'react-native';
import { Drawer, Menu, Popover, Tooltip } from './index';

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('floating (native)', () => {
  it('Menu runs the chosen action and closes; disabled items do nothing', async () => {
    const onSelect = jest.fn();
    const onClose = jest.fn();
    function Harness() {
      const anchor = useRef<HostInstance>(null);
      return (
        <>
          <View ref={anchor} />
          <Menu
            anchor={anchor}
            open
            onClose={onClose}
            accessibilityLabel="Card actions"
            items={[
              { label: 'Freeze card', onSelect },
              { label: 'Set limits', onSelect, disabled: true },
            ]}
          />
        </>
      );
    }
    await render(<Harness />);
    await fireEvent.press(screen.getByRole('menuitem', { name: 'Set limits' }));
    expect(onSelect).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('menuitem', { name: 'Freeze card' }));
    expect([onSelect.mock.calls.length, onClose.mock.calls.length]).toEqual([1, 1]);
  });

  it('Popover closes from a tap outside, and from the VoiceOver escape gesture', async () => {
    const onClose = jest.fn();
    function Harness() {
      const anchor = useRef<HostInstance>(null);
      return (
        <>
          <View ref={anchor} />
          <Popover anchor={anchor} open onClose={onClose} accessibilityLabel="Fee details" testID="panel">
            <Text>No fee on UPI.</Text>
          </Popover>
        </>
      );
    }
    await render(<Harness />);
    expect(screen.getByText('No fee on UPI.')).toBeTruthy();
    // The backdrop is for touch; screen readers can't reach it past the modal panel
    await fireEvent.press(screen.getByRole('button', { name: 'Close', includeHiddenElements: true }));
    await fireEvent(screen.getByTestId('panel'), 'accessibilityEscape');
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('Tooltip shows on a long press without taking the press from its child', async () => {
    jest.useFakeTimers();
    const onPress = jest.fn();
    function Harness() {
      const [count] = useState(0);
      return (
        <Tooltip label="Copy UPI ID" testID="tip">
          <Pressable accessibilityRole="button" accessibilityLabel="Copy UPI ID" onPress={onPress}>
            <Text>{count}</Text>
          </Pressable>
        </Tooltip>
      );
    }
    await render(<Harness />);
    const button = screen.getByRole('button', { name: 'Copy UPI ID' });
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
    await fireEvent(button, 'touchStart');
    await act(async () => jest.advanceTimersByTime(450));
    expect(screen.getByTestId('tip', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.queryByTestId('tip')).toBeNull();
    await act(async () => jest.advanceTimersByTime(1500));
    expect(screen.queryByTestId('tip', { includeHiddenElements: true })).toBeNull();
  });

  it('Drawer shows its title and closes from the backdrop', async () => {
    const onClose = jest.fn();
    await render(
      <Drawer open title="Filters" onClose={onClose} testID="drawer">
        Pick categories
      </Drawer>
    );
    expect(screen.getByRole('header', { name: 'Filters' })).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Close', includeHiddenElements: true }));
    await fireEvent(screen.getByTestId('drawer'), 'accessibilityEscape');
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
