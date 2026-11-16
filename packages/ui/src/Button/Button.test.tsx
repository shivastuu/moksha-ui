import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button, ThemeProvider, createTheme, useTheme } from '../index';

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
  it('scopes the color scheme and adds the component styles once', () => {
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
    expect(screen.getByText('One').closest('[data-ds-scheme]')?.getAttribute('data-ds-scheme')).toBe('dark');
    expect(screen.getByText('Two').closest('[data-ds-scheme]')?.getAttribute('data-ds-scheme')).toBe('light');
    expect(document.querySelectorAll('style[data-href="shivastu-ui"]')).toHaveLength(1);

    const id = screen.getByText('One').closest('[data-ds-theme]')?.getAttribute('data-ds-theme');
    const css = document.querySelector(`style[data-href="shivastu-ui-theme-${id}"]`)?.textContent ?? '';
    expect(css).toContain(`[data-ds-theme="${id}"][data-ds-scheme=light]{color-scheme:light;`);
    expect(css).toContain('--ds-color-primary:#5B40DB');
    expect(css).toContain('--ds-space-lg:16px');
    expect(css).toContain('--ds-button-md-height:44px');
    expect(css).toContain('--ds-glass-blur-md:24px');
    expect(css).toContain('--ds-shadow-md:');
  });

  it('scopes two custom themes on one page without clashing', () => {
    const teal = createTheme({ brandColor: '#0E7C66' });
    const rose = createTheme({ brandColor: '#E11D48', foundations: { radius: { md: 4 } } });
    render(
      <>
        <ThemeProvider theme={teal}>
          <Button>Teal</Button>
        </ThemeProvider>
        <ThemeProvider theme={rose}>
          <Button>Rose</Button>
        </ThemeProvider>
      </>
    );
    const tealId = screen.getByText('Teal').closest('[data-ds-theme]')?.getAttribute('data-ds-theme');
    const roseId = screen.getByText('Rose').closest('[data-ds-theme]')?.getAttribute('data-ds-theme');
    expect(tealId).not.toBe(roseId);
    const tealCss = document.querySelector(`style[data-href="shivastu-ui-theme-${tealId}"]`)?.textContent;
    const roseCss = document.querySelector(`style[data-href="shivastu-ui-theme-${roseId}"]`)?.textContent;
    expect(tealCss).toContain(`--ds-color-primary:${teal.themes.light.colors.primary}`);
    expect(roseCss).toContain(`--ds-color-primary:${rose.themes.light.colors.primary}`);
    expect(roseCss).toContain('--ds-radius-md:4px');
  });

  it('lets a nested provider change the scheme and keep the parent theme', () => {
    const teal = createTheme({ brandColor: '#0E7C66' });
    function Probe() {
      const { colors, scheme } = useTheme();
      return <span>{`${scheme} ${colors.primary}`}</span>;
    }
    render(
      <ThemeProvider theme={teal}>
        <ThemeProvider colorScheme="dark">
          <Probe />
        </ThemeProvider>
      </ThemeProvider>
    );
    expect(screen.getByText(`dark ${teal.themes.dark.colors.primary}`)).toBeTruthy();
  });
});
