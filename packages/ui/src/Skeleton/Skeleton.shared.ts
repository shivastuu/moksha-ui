import { mix, type SemanticColors } from '@moksha-ui/tokens';

export interface SkeletonProps {
  /** `text` draws `lines` of text, `rect` a block, `circle` an avatar @default 'text' */
  shape?: 'text' | 'rect' | 'circle';
  /** Text only: number of lines; the last one is shorter @default 1 */
  lines?: number;
  /** Width in px or a percentage like '60%' @default '100%' (circle: height) */
  width?: number | `${number}%`;
  /** Height in px @default 16 for text, 48 otherwise */
  height?: number;
  testID?: string;
}

/** A faint block that breathes while content loads */
export function skeletonColors({ text, background }: SemanticColors) {
  return { base: mix(text, background, 0.08) };
}

export const skeletonBlocks = ({ shape = 'text', lines = 1, width = '100%', height }: SkeletonProps) => {
  if (shape === 'circle') {
    const size = height ?? (typeof width === 'number' ? width : 48);
    return [{ width: size, height: size, round: true }];
  }
  if (shape === 'rect') {
    return [{ width, height: height ?? 48, round: false }];
  }
  return Array.from({ length: lines }, (_, index) => ({
    width: lines > 1 && index === lines - 1 ? '60%' : width,
    height: height ?? 16,
    round: false,
  }));
};
