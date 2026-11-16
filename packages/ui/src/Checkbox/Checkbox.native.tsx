import { Animated, Pressable, Text, View } from 'react-native';
import { usePop } from '../motion/nativeMotion.native';
import { useTheme } from '../theme/context';
import { textStyleFor } from '../theme/textStyle';
import { controlColors } from '../utils/controls';
import { useControllableState } from '../utils/useControllableState';
import type { CheckboxProps } from './Checkbox.shared';

/** A checkbox with a check mark that pops in, and a "mixed" state for partial selections */
export function Checkbox({ checked, defaultChecked = false, onCheckedChange, label, description, accessibilityLabel, disabled, testID }: CheckboxProps) {
  const theme = useTheme();
  const { colors, components, opacity, space } = theme;
  const { size, radius } = components.checkbox;
  const mixed = checked === 'mixed';
  const [on, setOn] = useControllableState(mixed ? false : checked, defaultChecked, onCheckedChange);
  const filled = on || mixed;
  const scale = usePop(filled ? (mixed ? 'mixed' : 'checked') : '');
  const ink = colors.textOnPrimary;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityLabel={label ?? accessibilityLabel}
      accessibilityHint={description}
      accessibilityState={{ checked: mixed ? 'mixed' : on, disabled: !!disabled }}
      disabled={disabled}
      hitSlop={6}
      onPress={() => setOn(!on)}
      style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space.md, opacity: disabled ? opacity.disabled : 1 }}
    >
      <View
        style={{
          width: size,
          height: size,
          marginTop: (theme.typography.textStyles.body.lineHeight - size) / 2,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radius,
          borderWidth: 1.5,
          borderColor: filled ? colors.primary : controlColors(colors).boxBorder,
          backgroundColor: filled ? colors.primary : colors.background,
        }}
      >
        {filled ? (
          <Animated.View style={{ transform: [{ scale }] }}>
            {mixed ? (
              <View style={{ width: size * 0.5, height: 2.5, borderRadius: 2, backgroundColor: ink }} />
            ) : (
              <View style={{ width: size * 0.3, height: size * 0.55, marginTop: -size * 0.1, borderRightWidth: 2.5, borderBottomWidth: 2.5, borderColor: ink, transform: [{ rotate: '45deg' }] }} />
            )}
          </Animated.View>
        ) : null}
      </View>
      {label ? (
        <View style={{ flexShrink: 1, gap: 2 }}>
          <Text style={[textStyleFor(theme, 'body'), { color: colors.text }]}>{label}</Text>
          {description ? <Text style={[textStyleFor(theme, 'bodySmall'), { color: colors.textMuted }]}>{description}</Text> : null}
        </View>
      ) : null}
    </Pressable>
  );
}
