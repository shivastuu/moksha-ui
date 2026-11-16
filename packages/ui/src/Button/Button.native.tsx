import { ActivityIndicator, Animated, Pressable, StyleSheet, Text } from 'react-native';
import type { SemanticColors } from '@shivastu/tokens';
import { usePressScale } from '../motion/nativeMotion.native';
import { useTheme } from '../theme/context';
import type { ButtonProps, ButtonVariant } from './Button.shared';

function variantStyle(variant: ButtonVariant, colors: SemanticColors, pressed: boolean) {
  if (variant === 'primary') {
    return { backgroundColor: pressed ? colors.primaryPressed : colors.primary };
  }
  return {
    backgroundColor: pressed ? colors.primarySubtle : 'transparent',
    borderColor: variant === 'secondary' ? colors.primary : 'transparent',
  };
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  fullWidth,
  accessibilityLabel,
  testID,
}: ButtonProps) {
  const { colors, components, opacity, typography, nativeFonts } = useTheme();
  const { button } = components;
  const metrics = button.sizes[size];
  const isDisabled = !!disabled || !!loading;
  const press = usePressScale();
  const color = variant === 'primary' ? colors.textOnPrimary : colors.primary;

  return (
    <Animated.View style={[fullWidth ? styles.fullWidth : styles.inline, { transform: [{ scale: press.scale }] }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: isDisabled, busy: !!loading }}
        disabled={isDisabled}
        onPress={onPress}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        testID={testID}
        style={({ pressed }) => [
          styles.base,
          {
            minHeight: metrics.height,
            paddingHorizontal: metrics.paddingX,
            borderRadius: button.radius,
            borderWidth: button.borderWidth,
            gap: button.gap,
          },
          variantStyle(variant, colors, pressed),
          disabled && { opacity: opacity.disabled },
        ]}
      >
        {loading && (
          <ActivityIndicator
            size="small"
            color={color}
            testID={testID ? `${testID}-spinner` : undefined}
          />
        )}
        <Text
          style={{
            color,
            fontSize: metrics.fontSize,
            fontFamily: nativeFonts?.[button.fontWeight],
            fontWeight: nativeFonts ? undefined : typography.fontWeight[button.fontWeight],
          }}
        >
          {children}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'transparent',
  },
  inline: { alignSelf: 'flex-start' },
  fullWidth: { alignSelf: 'stretch' },
});
