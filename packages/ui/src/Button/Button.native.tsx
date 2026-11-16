import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import type { SemanticColors } from '@shivastu/tokens';
import { useTheme } from '../theme/context';
import { buttonMetrics, type ButtonProps, type ButtonVariant } from './Button.shared';

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
  const { colors, tokens, nativeFonts } = useTheme();
  const metrics = buttonMetrics[size];
  const isDisabled = !!disabled || !!loading;
  const color = variant === 'primary' ? colors.onPrimary : colors.primary;

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
          borderRadius: tokens.radius.md,
          gap: tokens.space.sm,
        },
        variantStyle(variant, colors, pressed),
        fullWidth ? styles.fullWidth : styles.inline,
        disabled && styles.disabled,
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
          fontWeight: nativeFonts ? undefined : tokens.fontWeight.semibold,
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
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inline: { alignSelf: 'flex-start' },
  fullWidth: { alignSelf: 'stretch' },
  disabled: { opacity: 0.5 },
});
