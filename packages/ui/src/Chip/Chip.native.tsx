import { Animated, Text, View } from 'react-native';
import { usePop } from '../motion/nativeMotion.native';
import { Press } from '../motion/Press.native';
import { useTheme } from '../theme/context';
import { fontFor } from '../theme/textStyle';
import { controlColors } from '../utils/controls';
import { chipColors, type ChipProps } from './Chip.shared';

/** A check mark drawn as the corner of a rotated box, popping in */
function Check({ color, size }: { color: string; size: number }) {
  const scale = usePop(true);
  return (
    <Animated.View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', transform: [{ scale }] }}>
      <View
        style={{
          width: size * 0.32,
          height: size * 0.6,
          marginTop: -size * 0.12,
          borderRightWidth: 2,
          borderBottomWidth: 2,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </Animated.View>
  );
}

/** A bordered, toggleable filter or choice, like "Food" or "Last 30 days" */
export function Chip({ label, selected = false, onSelectedChange, icon, disabled, size = 'md', testID }: ChipProps) {
  const theme = useTheme();
  const { colors, space, radius, borderWidth, typography, opacity, shadows } = theme;
  const fontSize = typography.fontSize[size === 'sm' ? 'xs' : 'sm'];
  const color = selected ? colors.primary : colors.text;
  return (
    <Press
      object
      ink={color}
      fill={selected ? controlColors(colors).selectedFill : colors.background}
      outerStyle={{ alignSelf: 'flex-start' }}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled: !!disabled }}
      disabled={disabled}
      onPress={() => onSelectedChange?.(!selected)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.xs,
        height: size === 'sm' ? 32 : 36,
        paddingHorizontal: size === 'sm' ? space.md : space.md + 2,
        borderRadius: radius.full,
        borderWidth: borderWidth.thin,
        borderColor: selected ? chipColors(colors).selectedBorder : colors.border,
        boxShadow: shadows.sm,
        opacity: disabled ? opacity.disabled : 1,
      }}
    >
      {selected ? <Check color={color} size={fontSize * 1.15} /> : icon}
      <Text style={{ color, fontSize, ...fontFor(theme, 'medium') }}>{label}</Text>
    </Press>
  );
}
