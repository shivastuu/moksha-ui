import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { contrastRatio, createTheme, defaultTheme, type ColorScheme } from '@shivastu/tokens';
import { fireEvent } from '@testing-library/react';
import { Badge, Chip, Divider, Skeleton, Spinner, Stack, Tag, Text } from './index';
import { softTones, solidTones, textTones, tones } from './utils/tones';

afterEach(cleanup);

describe('tones', () => {
  const themes = [defaultTheme, ...['#E11D48', '#F97316', '#FACC15', '#84CC16', '#06B6D4', '#7C3AED', '#111111', '#F5F5F5'].map((brandColor) => createTheme({ brandColor }))];
  it('text tones read at WCAG AA on the background, and badge text on its fill, in every theme', () => {
    for (const theme of themes) {
      for (const scheme of ['light', 'dark'] as ColorScheme[]) {
        const { colors } = theme.themes[scheme];
        for (const tone of tones) {
          expect(contrastRatio(textTones(colors)[tone], colors.background), `${tone} text, ${scheme}`).toBeGreaterThanOrEqual(4.5);
        }
        for (const [tone, { background, ink }] of Object.entries(solidTones(colors))) {
          expect(contrastRatio(ink, background), `${tone} badge, ${scheme}`).toBeGreaterThanOrEqual(4.5);
        }
        for (const [tone, { background, ink }] of Object.entries(softTones(colors))) {
          expect(contrastRatio(ink, background), `${tone} tag, ${scheme}`).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });
});

describe('Text (web)', () => {
  it('renders the element, style, tone, weight and line clamp asked for', () => {
    render(
      <Text as="h2" variant="heading" tone="success" weight="medium" numberOfLines={2} testID="t">
        Payment sent
      </Text>
    );
    const text = screen.getByRole('heading', { level: 2, name: 'Payment sent' });
    expect(text.className).toBe('ds-text ds-text--heading ds-text--tone-success ds-text--clamp');
    expect([text.style.fontWeight, text.style.webkitLineClamp]).toEqual(['var(--ds-font-weight-medium)', '2']);
  });

  it('inherits its color without a tone', () => {
    render(<Text>Hi</Text>);
    expect(screen.getByText('Hi').className).toBe('ds-text ds-text--body');
  });
});

describe('Stack (web)', () => {
  it('maps its props to flex layout with theme spacing', () => {
    render(
      <Stack direction="row" gap="lg" align="center" justify="between" wrap testID="s">
        <span>a</span>
      </Stack>
    );
    const { style } = screen.getByTestId('s');
    expect([style.flexDirection, style.gap, style.alignItems, style.justifyContent, style.flexWrap]).toEqual([
      'row',
      'var(--ds-space-lg)',
      'center',
      'space-between',
      'wrap',
    ]);
  });
});

describe('Divider (web)', () => {
  it('is a separator, with an optional label or vertical orientation', () => {
    const { rerender } = render(<Divider />);
    expect(screen.getByRole('separator').tagName).toBe('HR');
    rerender(<Divider label="or continue with" />);
    expect(screen.getByRole('separator').textContent).toBe('or continue with');
    rerender(<Divider orientation="vertical" />);
    expect(screen.getByRole('separator').getAttribute('aria-orientation')).toBe('vertical');
  });
});

describe('Spinner (web)', () => {
  it('is a named progress indicator at the token size', () => {
    render(<Spinner size="lg" label="Loading transactions" />);
    const spinner = screen.getByRole('progressbar', { name: 'Loading transactions' });
    expect(spinner.style.width).toBe('36px');
  });
});

describe('Skeleton (web)', () => {
  it('draws hidden placeholder blocks: short last line, circles from height', () => {
    const { container, rerender } = render(<Skeleton lines={3} testID="sk" />);
    expect(screen.getByTestId('sk').getAttribute('aria-hidden')).toBe('true');
    const widths = () => [...container.querySelectorAll<HTMLElement>('.ds-skeleton')].map((block) => block.style.width);
    expect(widths()).toEqual(['100%', '100%', '60%']);
    rerender(<Skeleton shape="circle" height={40} />);
    expect(container.querySelector('.ds-skeleton--round')?.getAttribute('style')).toBe('width: 40px; height: 40px;');
  });
});

describe('Badge (web)', () => {
  it('shows counts with a cap, hides at zero, and pops again on change', () => {
    const { container, rerender } = render(<Badge count={3} label="3 unread messages" />);
    const first = screen.getByRole('status', { name: '3 unread messages' });
    expect(first.textContent).toBe('3');
    rerender(<Badge count={120} />);
    expect(screen.getByRole('status', { name: '99+' })).not.toBe(first);
    rerender(<Badge count={0} />);
    expect(container.innerHTML).toBe('');
  });

  it('treats a dot without a label as decoration', () => {
    const { rerender } = render(<Badge dot testID="dot" />);
    expect(screen.getByTestId('dot').getAttribute('aria-hidden')).toBe('true');
    rerender(<Badge dot label="New offers" tone="primary" testID="dot" />);
    expect(screen.getByRole('status', { name: 'New offers' }).className).toBe('ds-badge ds-badge--primary ds-badge--dot');
  });
});

describe('Tag (web)', () => {
  it('is a bordered pill with a tone, an optional dot or icon', () => {
    const { container, rerender } = render(<Tag tone="success" dot>Paid</Tag>);
    expect(screen.getByText('Paid').className).toBe('ds-tag ds-tag--success ds-tag--md');
    expect(container.querySelector('.ds-tag__dot')?.getAttribute('aria-hidden')).toBe('true');
    rerender(<Tag icon={<svg data-testid="icon" />} size="sm">Blocked</Tag>);
    expect(screen.getByTestId('icon')).toBeTruthy();
    expect(container.querySelector('.ds-tag__dot')).toBeNull();
  });
});

describe('Chip (web)', () => {
  it('toggles, reports its state, and shows a check while selected', () => {
    let selected = false;
    const { container, rerender } = render(<Chip label="Food" onSelectedChange={(next) => (selected = next)} />);
    const chip = screen.getByRole('button', { name: 'Food', pressed: false });
    fireEvent.click(chip);
    expect(selected).toBe(true);
    rerender(<Chip label="Food" selected onSelectedChange={(next) => (selected = next)} />);
    expect(screen.getByRole('button', { name: 'Food', pressed: true })).toBe(chip);
    expect(container.querySelector('.ds-chip__check')).not.toBeNull();
    fireEvent.click(chip);
    expect(selected).toBe(false);
  });
});
