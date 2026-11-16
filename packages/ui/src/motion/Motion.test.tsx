import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Motion, OtpField, Stagger, TextField } from '../index';
import { parseCubicBezier } from './motion.shared';

// jsdom has no AnimationEvent, and React only listens for animationend when it exists
vi.hoisted(() => {
  globalThis.AnimationEvent ??= class extends Event {
    animationName: string;
    constructor(type: string, init?: AnimationEventInit) {
      super(type, init);
      this.animationName = init?.animationName ?? '';
    }
  } as unknown as typeof AnimationEvent;
});

afterEach(cleanup);

describe('Motion (web)', () => {
  it('plays the preset with token timing', () => {
    render(
      <Motion preset="scaleIn" duration="slow" easing="standard" delay={120} testID="card">
        Hi
      </Motion>
    );
    const card = screen.getByTestId('card');
    expect(card.className).toBe('ds-motion ds-motion--scale-in');
    expect(card.style.animationDuration).toBe('var(--ds-duration-slow)');
    expect(card.style.animationTimingFunction).toBe('var(--ds-easing-standard)');
    expect(card.style.animationDelay).toBe('120ms');
  });

  it('moves with a spring when asked, instead of the duration and easing tokens', () => {
    render(
      <Motion preset="slideUp" spring="smooth" duration="slow" testID="sheet">
        Hi
      </Motion>
    );
    const sheet = screen.getByTestId('sheet');
    expect(sheet.style.animationDuration).toBe('var(--ds-spring-smooth-duration)');
    expect(sheet.style.animationTimingFunction).toBe('var(--ds-spring-smooth)');
  });

  it('staggers children by the theme interval, or the one given', () => {
    const { rerender } = render(
      <Stagger delay={100}>
        <p>One</p>
        <p>Two</p>
        <p>Three</p>
      </Stagger>
    );
    const delays = () => ['One', 'Two', 'Three'].map((text) => screen.getByText(text).parentElement!.style.animationDelay);
    expect(delays()).toEqual(['100ms', '150ms', '200ms']);

    rerender(
      <Stagger interval={80}>
        <p>One</p>
        <p>Two</p>
        <p>Three</p>
      </Stagger>
    );
    expect(delays()).toEqual(['', '80ms', '160ms']);
  });

  it('reads the easing tokens as numbers for native', () => {
    expect(parseCubicBezier('cubic-bezier(0.2, 0, 0, 1)')).toEqual([0.2, 0, 0, 1]);
    expect(parseCubicBezier('cubic-bezier(.3,-.5,.7,1.5)')).toEqual([0.3, -0.5, 0.7, 1.5]);
    expect(() => parseCubicBezier('ease-in')).toThrow('cubic-bezier');
  });
});

describe('Error shake (web)', () => {
  it('shakes a TextField when an error appears, not when it starts with one', () => {
    const { rerender } = render(<TextField label="PAN" error="Required" testID="pan" />);
    const control = screen.getByTestId('pan-control');
    expect(control.className).not.toContain('--shake');

    rerender(<TextField label="PAN" testID="pan" />);
    rerender(<TextField label="PAN" error="Enter a valid PAN" testID="pan" />);
    expect(control.className).toContain('ds-field__control--shake');

    fireEvent.animationEnd(control, { animationName: 'ds-shake' });
    expect(control.className).not.toContain('--shake');
  });

  it('pops OTP digits in and shakes the row on a wrong code', () => {
    const { container, rerender } = render(<OtpField label="Enter OTP" length={4} defaultValue="12" />);
    expect([...container.querySelectorAll('.ds-otp__digit')].map((digit) => digit.textContent)).toEqual(['1', '2']);

    rerender(<OtpField label="Enter OTP" length={4} defaultValue="12" error="Wrong OTP" />);
    const row = container.querySelector('.ds-otp')!;
    expect(row.className).toBe('ds-otp ds-otp--shake');

    // A digit's pop ending must not cut the shake short
    fireEvent.animationEnd(container.querySelector('.ds-otp__digit')!, { animationName: 'ds-pop' });
    expect(row.className).toBe('ds-otp ds-otp--shake');
    fireEvent.animationEnd(row, { animationName: 'ds-shake' });
    expect(row.className).toBe('ds-otp');
  });
});
