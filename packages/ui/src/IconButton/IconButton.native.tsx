import { Animated, Pressable } from 'react-native';
import { buttonDepth } from '../Button/Button.shared';
import { usePressScale } from '../motion/nativeMotion.native';
import { useTheme } from '../theme/context';
import type { IconButtonProps } from './IconButton.shared';

/** A round button with only an icon. Pass `accessibilityLabel`, since an icon alone has no name */
export function IconButton({ icon, accessibilityLabel, onPress, variant = 'soft', size = 'md', disabled, pressed, testID }: IconButtonProps) {
  const { colors, components, opacity, borderWidth, blurView: BlurView } = useTheme();
  const press = usePressScale();
  const depth = buttonDepth(colors);
  const dimension = components.iconButton.sizes[size];
  const look = {
    solid: { backgroundColor: colors.primary, backgroundImage: depth.primaryFill, boxShadow: depth.primaryShadow },
    soft: { backgroundColor: depth.tint },
    glass: { backgroundColor: BlurView ? colors.glassSurface : colors.surfaceRaised, borderColor: colors.glassBorder },
    ghost: { backgroundColor: 'transparent' },
  }[variant];

  return (
    <Animated.View style={{ transform: [{ scale: press.scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: !!disabled, selected: pressed }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        testID={testID}
        style={{
          width: dimension,
          height: dimension,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: dimension / 2,
          borderWidth: borderWidth.thin,
          borderColor: 'transparent',
          overflow: variant === 'glass' ? 'hidden' : 'visible',
          opacity: disabled ? opacity.disabled : 1,
          ...look,
        }}
      >
        {icon}
      </Pressable>
    </Animated.View>
  );
}
