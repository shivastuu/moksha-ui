import { ActivityIndicator, Animated } from 'react-native';
import { breathOpacity, useBreathe } from '../motion/nativeMotion.native';
import { useTheme } from '../theme/context';
import type { SpinnerProps } from './Spinner.shared';

/** The platform's own spinner, in the theme color, breathing on the theme's rhythm */
export function Spinner({ size = 'md', tone = 'primary', label = 'Loading', testID }: SpinnerProps) {
  const { colors, motion } = useTheme();
  const breath = useBreathe();
  return (
    <Animated.View style={{ opacity: breathOpacity(breath, motion.breathe.low) }}>
      <ActivityIndicator
        testID={testID}
        accessibilityRole="progressbar"
        accessibilityLabel={label}
        size={size === 'lg' ? 'large' : 'small'}
        color={tone === 'primary' ? colors.primary : colors.text}
      />
    </Animated.View>
  );
}
