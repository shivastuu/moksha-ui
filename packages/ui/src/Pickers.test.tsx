import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { DatePicker, FileUpload } from './index';
import { addDays, addMonths, dayText, monthGrid, moveDay, parseDay, spokenDay } from './DatePicker/DatePicker.shared';
import { addFiles, formatBytes, matchesAccept } from './FileUpload/FileUpload.shared';

// jsdom has no popover top layer and hides every [popover]; the real top layer is checked in Chrome
beforeAll(() => {
  HTMLElement.prototype.showPopover = vi.fn();
  const style = document.createElement('style');
  style.textContent = '[popover]{display:block}';
  document.head.append(style);
});

afterEach(cleanup);

describe('date logic', () => {
  it('reads only real days, and keeps month ends when adding months', () => {
    expect([parseDay('2026-02-30'), parseDay('17/11/2026'), parseDay('2026-11-17')]).toEqual([undefined, undefined, { year: 2026, month: 11, day: 17 }]);
    expect(dayText(addMonths(parseDay('2026-01-31')!, 1))).toBe('2026-02-28');
    expect(dayText(addMonths(parseDay('2028-01-31')!, 1))).toBe('2028-02-29');
    expect(dayText(addMonths(parseDay('2026-03-15')!, -14))).toBe('2025-01-15');
  });

  it('steps one day at a time across a whole year, whatever the time zone and DST', () => {
    let day = parseDay('2026-01-01')!;
    const seen = new Set<string>();
    for (let index = 0; index < 400; index += 1) {
      seen.add(dayText(day));
      day = addDays(day, 1);
    }
    expect(seen.size).toBe(400);
    expect(dayText(day)).toBe('2027-02-05');
  });

  it('lays out 6 weeks from the chosen first weekday', () => {
    const sunday = monthGrid(2026, 11, 0);
    const monday = monthGrid(2026, 11, 1);
    expect([sunday.length, dayText(sunday[0]!), dayText(monday[0]!), dayText(monday[41]!)]).toEqual([42, '2026-11-01', '2026-10-26', '2026-12-06']);
  });

  it('moves with the grid keys and names days in full', () => {
    const day = parseDay('2026-11-18')!; // a Wednesday
    expect(['ArrowLeft', 'ArrowDown', 'PageUp', 'Home', 'End'].map((key) => dayText(moveDay(key, day, 0)!))).toEqual(['2026-11-17', '2026-11-25', '2026-10-18', '2026-11-15', '2026-11-21']);
    expect(dayText(moveDay('Home', day, 1)!)).toBe('2026-11-16');
    expect(moveDay('a', day, 0)).toBeNull();
    expect(spokenDay(day)).toBe('Wednesday, 18 November 2026');
  });
});

describe('DatePicker (web)', () => {
  it('opens on today, moves with keys, picks, closes and returns focus', () => {
    const onValueChange = vi.fn();
    render(<DatePicker label="Transfer date" today="2026-11-17" onValueChange={onValueChange} />);
    const field = screen.getByRole('button', { name: 'Transfer date' });
    fireEvent.click(field);
    expect(field.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('dialog', { name: 'Choose Transfer date' })).toBeTruthy();
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Tuesday, 17 November 2026');
    expect(document.activeElement?.getAttribute('aria-current')).toBe('date');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
    fireEvent.keyDown(document.activeElement!, { key: 'PageDown' });
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Friday, 18 December 2026');
    expect(screen.getByText('December 2026')).toBeTruthy();
    fireEvent.click(document.activeElement!);
    expect(onValueChange).toHaveBeenCalledWith('2026-12-18');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(field);
    expect(field.textContent).toContain('18 Dec 2026');
  });

  it('keeps days outside min and max from being chosen', () => {
    const onValueChange = vi.fn();
    render(<DatePicker label="Transfer date" today="2026-11-17" min="2026-11-17" max="2026-11-30" onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Transfer date' }));
    const past = screen.getByRole('button', { name: 'Monday, 16 November 2026' });
    expect(past.getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(past);
    expect(onValueChange).not.toHaveBeenCalled();
    expect([screen.getByRole('button', { name: 'Previous month' }), screen.getByRole('button', { name: 'Next month' })].map((button) => (button as HTMLButtonElement).disabled)).toEqual([true, true]);
  });
});

describe('file rules', () => {
  const file = (name: string, size: number, type = '') => ({ name, size, type });

  it('formats sizes and matches accept lists', () => {
    expect([formatBytes(512), formatBytes(1536), formatBytes(5 * 1024 * 1024), formatBytes(1024)]).toEqual(['512 B', '1.5 KB', '5 MB', '1 KB']);
    expect(matchesAccept(file('PAN.PDF', 1), '.pdf')).toBe(true);
    expect(matchesAccept(file('photo.heic', 1, 'image/heic'), 'image/*')).toBe(true);
    expect(matchesAccept(file('notes.txt', 1, 'text/plain'), '.pdf,image/*')).toBe(false);
    expect(matchesAccept(file('a.bin', 1, 'application/pdf'), 'application/pdf')).toBe(true);
  });

  it('refuses wrong types and big files with a reason, skips duplicates, and replaces in single mode', () => {
    const rules = { accept: '.pdf,image/*', maxSize: 1024 * 1024 };
    const pan = file('pan.pdf', 2000, 'application/pdf');
    const result = addFiles([pan], [pan, file('aadhaar.jpg', 3000, 'image/jpeg'), file('notes.txt', 10, 'text/plain'), file('scan.png', 5 * 1024 * 1024, 'image/png')], { ...rules, multiple: true });
    expect(result.files.map((kept) => kept.name)).toEqual(['pan.pdf', 'aadhaar.jpg']);
    expect(result.errors).toEqual(["notes.txt isn't a file type we accept", 'scan.png is over 1 MB']);
    expect(addFiles([pan], [file('new.pdf', 10, 'application/pdf')], rules).files.map((kept) => kept.name)).toEqual(['new.pdf']);
  });
});

describe('FileUpload (web)', () => {
  it('adds dropped and browsed files, says why it refused one, and keeps focus when removing', () => {
    const onValueChange = vi.fn();
    const { container } = render(<FileUpload label="KYC documents" multiple accept=".pdf,image/*" maxSize={1024 * 1024} hint="PDF or images, up to 1 MB" onValueChange={onValueChange} />);
    expect(screen.getByRole('group', { name: 'KYC documents' })).toBeTruthy();
    const browse = screen.getByRole('button', { name: 'browse', description: 'PDF or images, up to 1 MB' });
    const input = container.querySelector<HTMLInputElement>('input[type=file]')!;
    expect([input.accept, input.multiple]).toEqual(['.pdf,image/*', true]);
    fireEvent.change(input, { target: { files: [new File(['%PDF'], 'pan.pdf', { type: 'application/pdf' })] } });
    fireEvent.drop(container.querySelector('.ds-upload__zone')!, {
      dataTransfer: { files: [new File(['x'], 'aadhaar.jpg', { type: 'image/jpeg' }), new File(['x'], 'notes.txt', { type: 'text/plain' })] },
    });
    expect(screen.getByRole('list', { name: 'KYC documents, chosen files' }).children).toHaveLength(2);
    expect(screen.getByRole('alert').textContent).toBe("notes.txt isn't a file type we accept");
    expect(screen.getByRole('status').textContent).toBe('1 file added');
    expect(onValueChange.mock.calls.at(-1)![0].map((kept: { name: string }) => kept.name)).toEqual(['pan.pdf', 'aadhaar.jpg']);
    act(() => screen.getByRole('button', { name: 'Remove pan.pdf' }).focus());
    fireEvent.click(screen.getByRole('button', { name: 'Remove pan.pdf' }));
    expect([document.activeElement, screen.getByRole('status').textContent]).toEqual([browse, 'pan.pdf removed']);
  });
});
