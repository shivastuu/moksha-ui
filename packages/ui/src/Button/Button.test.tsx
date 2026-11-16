import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button, ThemeProvider } from '../index';

afterEach(cleanup);

describe('Button (web)', () => {
  it('renders a native button with its label', () => {
    render(<Button>Pay now</Button>);
    const button = screen.getByRole('button', { name: 'Pay now' });
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('type')).toBe('button');
  });

  it('calls onPress when clicked', () => {
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Pay now</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['disabled', { disabled: true }],
    ['loading', { loading: true }],
  ])('blocks presses when %s', (_, props) => {
    const onPress = vi.fn();
    render(
      <Button onPress={onPress} {...props}>
        Pay now
      </Button>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('marks a loading button busy and shows a spinner', () => {
    render(<Button loading>Pay now</Button>);
    const button = screen.getByRole('button', { name: 'Pay now' });
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.querySelector('.ds-spinner')).not.toBeNull();
  });

  it('applies variant, size and width classes', () => {
    render(
      <Button variant="secondary" size="lg" fullWidth>
        Pay now
      </Button>
    );
    expect(screen.getByRole('button').className).toBe(
      'ds-button ds-button--secondary ds-button--lg ds-button--full'
    );
  });

  it('uses accessibilityLabel and testID', () => {
    render(
      <Button accessibilityLabel="Pay 500 rupees" testID="pay">
        Pay
      </Button>
    );
    expect(screen.getByTestId('pay').getAttribute('aria-label')).toBe('Pay 500 rupees');
  });
});

describe('ThemeProvider (web)', () => {
  it('scopes the color scheme and adds the styles once', () => {
    render(
      <>
        <ThemeProvider colorScheme="dark">
          <Button>One</Button>
        </ThemeProvider>
        <ThemeProvider>
          <Button>Two</Button>
        </ThemeProvider>
      </>
    );
    expect(screen.getByText('One').closest('[data-ds-scheme]')?.getAttribute('data-ds-scheme')).toBe(
      'dark'
    );
    expect(screen.getByText('Two').closest('[data-ds-scheme]')?.getAttribute('data-ds-scheme')).toBe(
      'light'
    );
    const styles = document.querySelectorAll('style[data-href="shivastu-ui"]');
    expect(styles).toHaveLength(1);
    const css = styles[0]?.textContent ?? '';
    expect(css).toContain('--ds-color-primary:#5B40DB');
    expect(css).toContain('--ds-space-lg:16px');
    expect(css).toContain('--ds-radius-md:10px');
    expect(css).toContain('--ds-duration-fast:150ms');
    expect(css).toContain('--ds-shadow-md:');
  });
});
