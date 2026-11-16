import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import type { SemanticColors } from '@shivastu/tokens';
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
  const { colors, components, opacity, nativeFonts } = useTheme();
  const { button } = components;
  const metrics = button.sizes[size];
  const isDisabled = !!disabled || !!loading;
  const color = variant === 'primary' ? colors.textOnPrimary : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled, busy: !!loading }}
      disabled={isDisabled}
      onPress={onPress}
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
        fullWidth ? styles.fullWidth : styles.inline,
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
          fontFamily: nativeFonts?.semibold,
          fontWeight: nativeFonts ? undefined : button.fontWeight,
        }}
      >
        {children}
      </Text>
    </Pressable>
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
