import { alpha, ensureContrast, mix, oklchToHex, palette, type SemanticColors } from '@moksha-ui/tokens';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  /** Full name: the accessible name, the initials, and the seed for the gradient */
  name: string;
  /** Photo URL. Falls back to the initials if it fails to load */
  src?: string;
  /** @default 'md' */
  size?: AvatarSize;
  /** A dot in the corner */
  status?: 'online' | 'busy' | 'offline';
  testID?: string;
}

export interface AvatarGroupProps {
  people: { name: string; src?: string }[];
  /** How many to show before "+N" @default 4 */
  max?: number;
  /** @default 'md' */
  size?: AvatarSize;
  testID?: string;
}

/** "Shivastu Shrivastava" → "SS", "Asha" → "A" */
export function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

const initialsInk = palette.slate[0];

/**
 * A gradient picked from the name, so the same person always gets the same colors. Both stops are
 * darkened just enough for white initials to read at WCAG AA
 */
export function avatarColors(name: string, colors: SemanticColors) {
  let hash = 0;
  for (const char of name) {
    hash = (hash * 31 + (char.codePointAt(0) ?? 0)) >>> 0;
  }
  const hue = hash % 360;
  const from = ensureContrast(oklchToHex({ l: 0.62, c: 0.14, h: hue }), initialsInk);
  const to = ensureContrast(oklchToHex({ l: 0.52, c: 0.15, h: (hue + 40) % 360 }), initialsInk);
  return {
    background: `linear-gradient(135deg, ${from}, ${to})`,
    fallback: mix(from, to, 0.5),
    ink: initialsInk,
    edge: alpha(colors.text, 0.08),
  };
}

export const statusTone = { online: 'success', busy: 'danger', offline: 'textMuted' } as const;

export const avatarLabel = (name: string, status?: AvatarProps['status']) => (status ? `${name}, ${status}` : name);

export const groupLabel = (people: AvatarGroupProps['people']) =>
  `${people.length} ${people.length === 1 ? 'person' : 'people'}: ${people.map((person) => person.name).join(', ')}`;
