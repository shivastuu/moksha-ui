import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Surface, ThemeProvider } from '../index';

afterEach(cleanup);

describe('Surface (web)', () => {
  it('renders a solid surface with token padding and radius', () => {
    render(<Surface testID="card">Balance</Surface>);
    const card = screen.getByTestId('card');
    expect(card.className).toBe('ds-surface ds-surface--solid');
    expect(card.style.padding).toBe('var(--ds-space-lg)');
    expect(card.style.borderRadius).toBe('var(--ds-radius-lg)');
    expect(card.style.boxShadow).toBe('');
  });

  it('renders glass with a backdrop blur from the theme and a shadow', () => {
    render(
      <Surface variant="glass" blur="lg" padding="xl" radius="xl" testID="card">
        Balance
      </Surface>
    );
    const card = screen.getByTestId('card');
    expect(card.className).toBe('ds-surface ds-surface--glass');
    expect(card.style.getPropertyValue('--ds-surface-blur')).toBe('var(--ds-glass-blur-lg)');
    expect(card.style.boxShadow).toBe('var(--ds-shadow-md), inset 0 1px 0 var(--ds-surface-highlight)');
  });

  it('ships glass styles with blur, saturation and a solid fallback', () => {
    render(
      <ThemeProvider>
        <Surface variant="glass">Balance</Surface>
      </ThemeProvider>
    );
    const css = document.querySelector('style[data-href="shivastu-ui"]')?.textContent ?? '';
    expect(css).toContain('backdrop-filter:blur(var(--ds-surface-blur)) saturate(var(--ds-glass-saturation))');
    expect(css).toContain('@media (prefers-reduced-transparency:reduce)');
    expect(css).toContain('@supports not');
  });

  it('allows turning the shadow off or choosing another', () => {
    render(
      <>
        <Surface variant="raised" shadow="none" testID="flat">
          A
        </Surface>
        <Surface shadow="lg" testID="lifted">
          B
        </Surface>
      </>
    );
    // A raised surface keeps its hairline edge without a shadow
    expect(screen.getByTestId('flat').style.boxShadow).toBe('0 0 0 1px var(--ds-surface-edge)');
    expect(screen.getByTestId('lifted').style.boxShadow).toBe('var(--ds-shadow-lg)');
  });
});
