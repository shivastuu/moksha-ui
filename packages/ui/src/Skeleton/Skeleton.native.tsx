import { Animated, View } from 'react-native';
import { breathOpacity, useBreathe } from '../motion/nativeMotion.native';
import { useTheme } from '../theme/context';
import { skeletonBlocks, skeletonColors, type SkeletonProps } from './Skeleton.shared';

/** A breathing placeholder while content loads. Hidden from screen readers */
export function Skeleton(props: SkeletonProps) {
  const { colors, motion, radius, space } = useTheme();
  const { base } = skeletonColors(colors);
  const breath = useBreathe();

  return (
    <Animated.View
      testID={props.testID}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ gap: space.sm, opacity: breathOpacity(breath, motion.breathe.low) }}
    >
      {skeletonBlocks(props).map((block, index) => (
        <View
          key={index}
          style={{ width: block.width, height: block.height, maxWidth: '100%', borderRadius: block.round ? radius.full : radius.sm, backgroundColor: base }}
        />
      ))}
    </Animated.View>
  );
}
