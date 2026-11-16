import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import { alpha } from '@shivastu/tokens';
import { useReducedMotion } from '../motion/useReducedMotion.native';
import { useTheme } from '../theme/context';
import { skeletonBlocks, skeletonColors, type SkeletonProps } from './Skeleton.shared';

/** A shimmering placeholder while content loads. Hidden from screen readers */
export function Skeleton(props: SkeletonProps) {
  const { colors, radius, space } = useTheme();
  const { base, shine } = skeletonColors(colors);
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(0);
  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced !== false || !width) {
      return;
    }
    const loop = Animated.loop(
      Animated.timing(sweep, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [reduced, width, sweep]);

  return (
    <View
      testID={props.testID}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={{ gap: space.sm }}
    >
      {skeletonBlocks(props).map((block, index) => (
        <View
          key={index}
          style={{
            width: block.width,
            height: block.height,
            maxWidth: '100%',
            overflow: 'hidden',
            borderRadius: block.round ? radius.full : radius.sm,
            backgroundColor: base,
          }}
        >
          {reduced === false && width ? (
            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width,
                backgroundImage: `linear-gradient(90deg, ${alpha(shine, 0)}, ${shine}, ${alpha(shine, 0)})`,
                transform: [{ translateX: sweep.interpolate({ inputRange: [0, 1], outputRange: [-width, width] }) }],
              }}
            />
          ) : null}
        </View>
      ))}
    </View>
  );
}
