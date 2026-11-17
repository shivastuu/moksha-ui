import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { themes } from '@moksha-ui/tokens';
import { Receipt, SlideToConfirm, Slider, Sparkline, Tag, ThemeProvider } from './index';
import { valueAt } from './Slider/Slider.shared';
import { sampleCurve, sparkColor, sparkPath, sparkPoints } from './Sparkline/Sparkline.shared';
import { textTones } from './utils/tones';

afterEach(cleanup);

describe('Slider (web)', () => {
  it('snaps a track position to the nearest step inside the range', () => {
    expect([valueAt(0.5, 0, 100, 1), valueAt(0.31, 0, 1, 0.1), valueAt(1.4, 0, 100, 5), valueAt(-1, 1000, 50000, 500), valueAt(0.333, 1000, 50000, 500)]).toEqual([50, 0.3, 100, 1000, 17500]);
  });

  it('is a labelled native range that speaks the formatted value and moves its fill', () => {
    const onValueChange = vi.fn();
    render(<Slider label="Monthly SIP" min={500} max={10000} step={500} defaultValue={2000} format={(n) => `₹ ${n}`} onValueChange={onValueChange} />);
    const range = screen.getByRole('slider', { name: 'Monthly SIP' }) as HTMLInputElement;
    expect([range.type, range.min, range.max, range.step, range.getAttribute('aria-valuetext')]).toEqual(['range', '500', '10000', '500', '₹ 2000']);
    fireEvent.change(range, { target: { value: '5000' } });
    expect(onValueChange).toHaveBeenCalledWith(5000);
    expect(range.style.getPropertyValue('--ds-slider-fill')).toBe(`${(4500 / 9500) * 100}%`);
  });
});

describe('SlideToConfirm (web)', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(300);
    HTMLElement.prototype.setPointerCapture = vi.fn();
  });
  afterEach(() => vi.restoreAllMocks());

  it('confirms from the keyboard, then shows Processing and Done', async () => {
    let finish!: () => void;
    const onConfirm = vi.fn(() => new Promise<void>((resolve) => (finish = resolve)));
    render(<SlideToConfirm label="Slide to pay ₹486" onConfirm={onConfirm} />);
    const control = screen.getByRole('button', { name: 'Slide to pay ₹486' });
    await act(async () => fireEvent.keyDown(control, { key: 'Enter' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect([control.getAttribute('aria-label'), control.getAttribute('aria-busy')]).toEqual(['Processing', 'true']);
    await act(async () => finish());
    expect(control.getAttribute('aria-label')).toBe('Done');
    await act(async () => fireEvent.keyDown(control, { key: 'Enter' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('ignores a plain mouse click, but takes a screen reader activation (a click with no pointer)', async () => {
    const onConfirm = vi.fn();
    render(<SlideToConfirm label="Slide to pay" onConfirm={onConfirm} />);
    const control = screen.getByRole('button', { name: 'Slide to pay' });
    await act(async () => fireEvent.click(control, { detail: 1 }));
    expect(onConfirm).not.toHaveBeenCalled();
    await act(async () => fireEvent.click(control, { detail: 0 }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('fires only when released past 90% of the track', async () => {
    const onConfirm = vi.fn();
    const { container } = render(<SlideToConfirm label="Slide to pay" onConfirm={onConfirm} />);
    const knob = container.querySelector('.ds-slide__knob')!;
    const slideTo = async (x: number) => {
      fireEvent.pointerDown(knob, { clientX: 0, pointerId: 1 });
      fireEvent.pointerMove(knob, { clientX: x, pointerId: 1 });
      await act(async () => fireEvent.pointerUp(knob, { clientX: x, pointerId: 1 }));
    };
    // The knob can travel 300 - 52 - 2 × 4 = 240px; 90% is 216px
    await slideTo(200);
    expect(onConfirm).not.toHaveBeenCalled();
    expect((container.querySelector('.ds-slide') as HTMLElement).style.getPropertyValue('--ds-slide-offset')).toBe('0px');
    await slideTo(230);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('springs back and stays ready when onConfirm rejects', async () => {
    const onConfirm = vi.fn().mockRejectedValue(new Error('declined'));
    render(<SlideToConfirm label="Slide to pay" onConfirm={onConfirm} />);
    const control = screen.getByRole('button', { name: 'Slide to pay' });
    await act(async () => fireEvent.keyDown(control, { key: ' ' }));
    expect([control.getAttribute('aria-label'), control.style.getPropertyValue('--ds-slide-offset')]).toEqual(['Slide to pay', '0px']);
    await act(async () => fireEvent.keyDown(control, { key: 'Enter' }));
    expect(onConfirm).toHaveBeenCalledTimes(2);
  });
});

describe('Sparkline', () => {
  it('never draws a peak or dip that is not in the data', () => {
    const data = [1, 5, 5.2, 2, 2, 8, 3];
    const points = sparkPoints(data, 120, 36);
    const curve = sampleCurve(points, 16);
    for (let segment = 0; segment < points.length - 1; segment += 1) {
      const [a, b] = [points[segment]![1], points[segment + 1]![1]];
      for (const [, y] of curve.slice(segment * 16 + 1, segment * 16 + 17)) {
        expect(y).toBeGreaterThanOrEqual(Math.min(a, b) - 1e-9);
        expect(y).toBeLessThanOrEqual(Math.max(a, b) + 1e-9);
      }
    }
    expect(sparkPath(points).startsWith('M4 ')).toBe(true);
  });

  it('is green going the good way and red going the bad way', () => {
    const { colors } = themes.light;
    expect(sparkColor(colors, [1, 3], 'auto')).toBe(textTones(colors).success);
    expect(sparkColor(colors, [1, 3], 'auto', false)).toBe(textTones(colors).danger);
    expect(sparkColor(colors, [3, 1], 'auto')).toBe(textTones(colors).danger);
  });

  it('is one named image, and nothing at all without data (web)', () => {
    const { container, rerender } = render(
      <ThemeProvider colorScheme="light">
        <Sparkline data={[1200, 1500, 1340, 1840]} accessibilityLabel="Spending this week, ₹1,200 rising to ₹1,840" />
      </ThemeProvider>
    );
    expect(screen.getByRole('img', { name: 'Spending this week, ₹1,200 rising to ₹1,840' }).querySelector('.ds-sparkline__line')?.getAttribute('pathLength')).toBe('1');
    rerender(
      <ThemeProvider colorScheme="light">
        <Sparkline data={[]} accessibilityLabel="Empty" />
      </ThemeProvider>
    );
    expect(container.querySelector('svg')).toBeNull();
  });
});

describe('Receipt (web)', () => {
  it('says the status in words and lists the details', () => {
    const { rerender } = render(
      <Receipt status="success" amount={486} title="Paid to Swiggy" subtitle="17 Nov 2026, 1:24 pm" details={[{ label: 'UTR', value: '4021 8876 1290' }, { label: 'Status', value: <Tag tone="success">Successful</Tag> }]} />
    );
    expect(screen.getByRole('region', { name: 'Payment successful' })).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Payment successful' })).toBeTruthy();
    expect(screen.getByText('4021 8876 1290')).toBeTruthy();
    rerender(<Receipt status="failed" amount={1840} title="Electricity board" details={[]} />);
    expect(screen.getByRole('img', { name: 'Payment failed' })).toBeTruthy();
  });
});
