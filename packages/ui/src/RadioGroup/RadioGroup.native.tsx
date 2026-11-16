import { Animated, Pressable, Text, View } from 'react-native';
import { usePop } from '../motion/nativeMotion.native';
import { useTheme } from '../theme/context';
import { textStyleFor } from '../theme/textStyle';
import { controlColors } from '../utils/controls';
import { useControllableState } from '../utils/useControllableState';
import type { RadioGroupProps, RadioOption } from './RadioGroup.shared';

function Dot({ checked, size, color, border }: { checked: boolean; size: number; color: string; border: string }) {
  const scale = usePop(checked);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', borderRadius: size / 2, borderWidth: 1.5, borderColor: checked ? color : border }}>
      {checked ? <Animated.View style={{ width: size / 2, height: size / 2, borderRadius: size / 4, backgroundColor: color, transform: [{ scale }] }} /> : null}
    </View>
  );
}

/** One choice from a few, as bordered option cards */
export function RadioGroup({ label, options, value, defaultValue = '', onValueChange, disabled, testID }: RadioGroupProps) {
  const theme = useTheme();
  const { colors, components, space, radius, borderWidth, opacity, shadows } = theme;
  const [selected, setSelected] = useControllableState(value, defaultValue, onValueChange);
  const row = (option: RadioOption) => {
    const checked = selected === option.value;
    const off = disabled || option.disabled;
    return (
      <Pressable
        key={option.value}
        accessibilityRole="radio"
        accessibilityLabel={option.label}
        accessibilityHint={option.description}
        accessibilityState={{ checked, disabled: !!off }}
        disabled={off}
        onPress={() => setSelected(option.value)}
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: space.md,
          paddingVertical: space.md,
          paddingHorizontal: space.lg,
          borderRadius: radius.lg,
          borderWidth: borderWidth.thin,
          borderColor: checked ? colors.primary : colors.border,
          backgroundColor: checked ? controlColors(colors).selectedFill : colors.background,
          boxShadow: shadows.sm,
          opacity: off ? opacity.disabled : 1,
        }}
      >
        <View style={{ marginTop: (theme.typography.textStyles.body.lineHeight - components.checkbox.size) / 2 }}>
          <Dot checked={checked} size={components.checkbox.size} color={colors.primary} border={controlColors(colors).boxBorder} />
        </View>
        <View style={{ flexShrink: 1, gap: 2 }}>
          <Text style={[textStyleFor(theme, 'body'), { color: colors.text }]}>{option.label}</Text>
          {option.description ? <Text style={[textStyleFor(theme, 'bodySmall'), { color: colors.textMuted }]}>{option.description}</Text> : null}
        </View>
      </Pressable>
    );
  };
  return (
    <View testID={testID} accessibilityRole="radiogroup" accessibilityLabel={label} style={{ gap: space.sm }}>
      <Text style={[textStyleFor(theme, components.field.labelStyle), { color: colors.text, marginBottom: space.xs }]}>{label}</Text>
      {options.map(row)}
    </View>
  );
}
