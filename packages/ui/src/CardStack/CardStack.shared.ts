import type { ReactNode } from 'react';

export interface StackCard {
  key: string;
  /** Names the card for "Show …" buttons and announcements, like "Moksha Metal •• 2290" */
  label: string;
  /** The card itself, usually a BankCard */
  card: ReactNode;
}

export interface CardStackProps {
  cards: StackCard[];
  /** Which card is in front */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** @default 'Your cards' */
  accessibilityLabel?: string;
  testID?: string;
}

/** How far each card behind is lifted, shrunk and darkened, per step back. A 24px lift keeps each peeking strip a 24px touch target (WCAG 2.5.8) */
export const stackStep = { lift: 24, shrink: 0.05, dim: 0.12 };

/** Steps behind the front card: the front is 0, the next card 1, and so on, wrapping around */
export const depthOf = (position: number, front: number, count: number) => (position - front + count) % count;

export const stackLook = (depth: number) => ({
  y: -depth * stackStep.lift,
  scale: 1 - depth * stackStep.shrink,
  brightness: 1 - depth * stackStep.dim,
});
