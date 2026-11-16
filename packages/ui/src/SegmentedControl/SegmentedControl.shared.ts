export interface SegmentedControlProps {
  options: { value: string; label: string }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** What the choice is about, like "Statement period" */
  accessibilityLabel: string;
  testID?: string;
}

/** Arrow keys move the choice, wrapping around; Home and End jump to the ends */
export function nextIndex(key: string, index: number, count: number) {
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (index + 1) % count;
    case 'ArrowLeft':
    case 'ArrowUp':
      return (index - 1 + count) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return null;
  }
}
