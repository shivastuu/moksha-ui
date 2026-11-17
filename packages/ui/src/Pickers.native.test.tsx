import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { DatePicker, FileUpload } from './index';

const settle = () => act(async () => {});

beforeEach(() => jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true));
afterEach(() => jest.restoreAllMocks());

describe('pickers (native)', () => {
  it('DatePicker opens a calendar sheet, marks today, and picks a day', async () => {
    const onValueChange = jest.fn();
    await render(<DatePicker label="Transfer date" today="2026-11-17" min="2026-11-17" onValueChange={onValueChange} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Transfer date, Choose a date' }));
    await settle();
    expect(screen.getByRole('button', { name: 'Tuesday, 17 November 2026, today' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Monday, 16 November 2026' }).props.accessibilityState).toMatchObject({ disabled: true });
    await fireEvent.press(screen.getByRole('button', { name: 'Wednesday, 18 November 2026' }));
    expect(onValueChange).toHaveBeenCalledWith('2026-11-18');
    expect(screen.getByRole('button', { name: 'Transfer date, Wednesday, 18 November 2026' })).toBeTruthy();
  });

  it('FileUpload is disabled without a picker, and adds and checks what the picker returns', async () => {
    const { rerender } = await render(<FileUpload label="PAN card" />);
    expect(screen.getByRole('button', { name: 'Choose a file for PAN card' }).props.accessibilityState).toMatchObject({ disabled: true });
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    const onPick = jest.fn().mockResolvedValue([
      { name: 'pan.pdf', size: 2048, type: 'application/pdf', uri: 'file:///pan.pdf' },
      { name: 'big.pdf', size: 9 * 1024 * 1024, type: 'application/pdf', uri: 'file:///big.pdf' },
    ]);
    await rerender(<FileUpload label="PAN card" multiple maxSize={5 * 1024 * 1024} onPick={onPick} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Choose files for PAN card' }));
    await settle();
    expect(screen.getByText('pan.pdf')).toBeTruthy();
    expect(screen.getByText('2 KB')).toBeTruthy();
    expect(screen.getByText('big.pdf is over 5 MB')).toBeTruthy();
    expect(announce).toHaveBeenCalledWith('1 file added. big.pdf is over 5 MB');
    await fireEvent.press(screen.getByRole('button', { name: 'Remove pan.pdf' }));
    expect(screen.queryByText('pan.pdf')).toBeNull();
  });
});
