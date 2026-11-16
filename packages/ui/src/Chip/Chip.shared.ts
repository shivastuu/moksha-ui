import type { ReactNode } from 'react';
import { mix, type SemanticColors } from '@moksha-ui/tokens';

export interface ChipProps {
  label: string;
  /** Shows the chip as chosen, with a check mark */
  selected?: boolean;
  /** Called with the new selected state */
  onSelectedChange?: (selected: boolean) => void;
  /** An icon before the label (the check mark replaces it while selected) */
  icon?: ReactNode;
  disabled?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md';
  testID?: string;
}

/** The border of a selected chip: the brand color, softened toward the background */
export const chipColors = ({ primary, background }: SemanticColors) => ({ selectedBorder: mix(primary, background, 0.45) });
