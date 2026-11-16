import { ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/context';
import type { SpinnerProps } from './Spinner.shared';

/** The platform's own spinner, in the theme color */
export function Spinner({ size = 'md', tone = 'primary', label = 'Loading', testID }: SpinnerProps) {
  const { colors } = useTheme();
  return (
    <ActivityIndicator
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      size={size === 'lg' ? 'large' : 'small'}
      color={tone === 'primary' ? colors.primary : colors.text}
    />
  );
}
