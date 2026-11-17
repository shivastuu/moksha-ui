import { Pressable, Text, View } from 'react-native';
import { Floating } from '../Popover/Floating.native';
import { surfaceColors } from '../Surface/Surface.shared';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { textTones } from '../utils/tones';
import type { MenuProps } from './Menu.shared';

/** A list of actions that opens from a trigger */
export function Menu({ anchor, open, onClose, accessibilityLabel, items, side, align = 'end', testID }: MenuProps) {
  const theme = useTheme();
  const { colors, space, radius, shadows, opacity } = theme;
  return (
    <Floating anchor={anchor} open={open} onClose={onClose} side={side} align={align} role="menu" label={accessibilityLabel} testID={testID}>
      <View style={{ minWidth: 200, padding: space.xs, borderRadius: radius.lg, backgroundColor: colors.surfaceRaised, boxShadow: `${shadows.lg}, 0px 0px 0px 1px ${surfaceColors(colors).edge}` }}>
        {items.map((item) => {
          const color = item.tone === 'danger' ? textTones(colors).danger : colors.text;
          return (
            <Pressable
              key={item.label}
              accessibilityRole="menuitem"
              accessibilityState={{ disabled: !!item.disabled }}
              disabled={item.disabled}
              onPress={() => {
                onClose();
                item.onSelect();
              }}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: space.sm,
                height: 44,
                paddingHorizontal: space.md,
                borderRadius: radius.md,
                backgroundColor: pressed ? colors.border : 'transparent',
                opacity: item.disabled ? opacity.disabled : 1,
              })}
            >
              {item.icon ? <View style={{ width: 18, alignItems: 'center' }}>{item.icon}</View> : null}
              <Text style={[textStyleFor(theme, 'bodySmall'), fontFor(theme, 'medium'), { color }]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </Floating>
  );
}
