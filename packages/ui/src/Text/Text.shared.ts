import type { ReactNode } from 'react';
import type { FontWeightName, TextStyleName } from 'tandemui-tokens';

export type TextTone = 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'danger';

export interface TextProps {
  children: ReactNode;
  /** A text style from the theme @default 'body' */
  variant?: TextStyleName;
  /** Color. Tones are adjusted to read at WCAG AA on the background. Without it, text inherits its color */
  tone?: TextTone;
  /** Overrides the variant's weight */
  weight?: FontWeightName;
  align?: 'left' | 'center' | 'right';
  /** Cuts the text after this many lines, with an ellipsis */
  numberOfLines?: number;
  /** Web only: the element to render, for headings and paragraphs @default 'span' */
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'label' | 'div';
  testID?: string;
}

/** Big text reads better a little tighter */
export const tracking: Partial<Record<TextStyleName, number>> = { display: -0.02, heading: -0.02, title: -0.01 };
