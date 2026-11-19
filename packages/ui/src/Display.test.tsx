import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { contrastRatio, themes } from '@moksha-ui/tokens';
import { Avatar, AvatarGroup, Link, ProgressBar, ProgressRing } from './index';
import { avatarColors, initials } from './Avatar/Avatar.shared';

afterEach(cleanup);

const names = ['Shivastu Shrivastava', 'Neha', 'Ravi Kumar', 'Meera N', 'Zoya Ali', 'Arjun Mehta', 'Kabir', 'Priya Sharma', 'Dev', 'Isha Patel'];

describe('Avatar (web)', () => {
  it('takes initials from the first and last word', () => {
    expect(names.slice(0, 3).map(initials)).toEqual(['SS', 'N', 'RK']);
    expect(initials('  ')).toBe('');
  });

  it('picks the same gradient for the same name, with white initials at WCAG AA', () => {
    for (const name of names) {
      const look = avatarColors(name, themes.light.colors);
      expect(avatarColors(name, themes.dark.colors).background).toBe(look.background);
      for (const stop of look.background.match(/#[0-9A-F]{6}/g) ?? []) {
        expect(contrastRatio(look.ink, stop), `${name} ${stop}`).toBeGreaterThanOrEqual(4.5);
      }
    }
    expect(avatarColors('Neha', themes.light.colors).background).not.toBe(avatarColors('Ravi', themes.light.colors).background);
  });

  it('is an image named by the person and status, and falls back to initials when the photo fails', () => {
    const { container } = render(<Avatar name="Shivastu Shrivastava" src="/me.jpg" status="online" />);
    const avatar = screen.getByRole('img', { name: 'Shivastu Shrivastava, online' });
    const photo = container.querySelector('img')!;
    expect(photo.getAttribute('alt')).toBe('');
    fireEvent.error(photo);
    expect(container.querySelector('img')).toBeNull();
    expect(avatar.textContent).toBe('SS');
  });

  it('groups people with "+N", read out once', () => {
    render(<AvatarGroup people={names.slice(0, 6).map((name) => ({ name }))} />);
    const group = screen.getByRole('group', { name: '6 people: Shivastu Shrivastava, Neha, Ravi Kumar, Meera N, Zoya Ali, Arjun Mehta' });
    expect(group.textContent).toBe('SSNRKMN+2');
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });
});

describe('ProgressBar (web)', () => {
  it('reports its value and slides the fill to it, clamped', () => {
    const { container, rerender } = render(<ProgressBar value={75} label="Spend limit used" />);
    const bar = screen.getByRole('progressbar', { name: 'Spend limit used' });
    expect([bar.getAttribute('aria-valuenow'), bar.getAttribute('aria-valuemax')]).toEqual(['75', '100']);
    const fill = () => container.querySelector<HTMLElement>('.ds-progress__fill')!.style.transform;
    expect(fill()).toBe('translateX(-25%)');
    rerender(<ProgressBar value={150} label="Spend limit used" />);
    expect(fill()).toBe('translateX(0%)');
  });

  it('breathes without a value, and has no value for screen readers', () => {
    render(<ProgressBar label="Uploading" />);
    const bar = screen.getByRole('progressbar', { name: 'Uploading' });
    expect(bar.dataset.indeterminate).toBe('true');
    expect(bar.getAttribute('aria-valuenow')).toBeNull();
  });
});

describe('ProgressRing (web)', () => {
  it('draws the arc to its value, keeps stroke thickness in px, and shows the center', () => {
    const { container } = render(
      <ProgressRing value={72} label="Budget used" size={80} thickness={8}>
        72%
      </ProgressRing>
    );
    expect(screen.getByRole('progressbar', { name: 'Budget used' }).textContent).toBe('72%');
    const arc = container.querySelector('.ds-ring__arc')!;
    expect(arc.getAttribute('stroke-dasharray')).toBe('72 100');
    expect(arc.getAttribute('stroke-width')).toBe('10');
  });
});

describe('Link (web)', () => {
  it('opens external links safely in a new tab and says so', () => {
    render(
      <Link href="https://www.rbi.org.in" external>
        RBI guidelines
      </Link>
    );
    const link = screen.getByRole('link', { name: 'RBI guidelines (opens in a new tab)' });
    expect([link.getAttribute('target'), link.getAttribute('rel')]).toEqual(['_blank', 'noopener noreferrer']);
  });

  it('calls onPress', () => {
    const onPress = vi.fn();
    render(<Link onPress={onPress}>View statement</Link>);
    fireEvent.click(screen.getByText('View statement'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
